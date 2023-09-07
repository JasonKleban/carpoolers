import * as React from "react";

const intersect = <T,>( items : T[][]) => 
    items.reduce((p, c) => !!p ? p.filter(e => c.includes(e)) : c, undefined as T[] | undefined) ?? [];

export interface KeyMonitorProps {
    searchable: { [ phrase : string ] : number[] };
    setMatches: (matches : number[]) => void;
    sequence : string[],
    setSequence : React.Dispatch<React.SetStateAction<string[]>>
    onEnterSingle: (index: number) => () => void
}

export const KeyMonitor = ({ searchable, sequence, setSequence, setMatches, onEnterSingle }: KeyMonitorProps) => {
    const pairs = React.useMemo(
        () => Array.from(Object.entries(searchable)), 
        [ searchable ]);

    const appendChar = React.useCallback((char : string) => {
        const [ head, ...rest ] = sequence;
        
        setSequence([ `${head ?? ""}${char}`, ...rest ]);
    }, [sequence, setSequence]);

    const backChar = React.useCallback(() => {
        const [ head, ...rest ] = sequence;

        if (!!(head ?? "").length) {
            setSequence([ `${head.substring(0, head.length - 1)}`, ...rest ]);
        } else {
            setSequence(rest);
        }
    }, [sequence, setSequence]);

    const appendToken = React.useCallback(() => {
        setSequence([ "", ...sequence.filter(i => i !== "") ]);
    }, [sequence, setSequence]);
    
    const clearSequence = React.useCallback(() => {
        setSequence([]);
    }, [setSequence]);

    const matches = React.useMemo(() => 
        intersect(sequence.map(token => 
            pairs.filter(([ phrase, index ]) => phrase.includes(token))
            .flatMap(([ phrase, index ]) => index))), 
        [ sequence, pairs ]);

    React.useEffect(() => {
        const onKey = (ev: KeyboardEvent) => {
            if ([ "Escape" ].includes(ev.code)) {
                clearSequence();
                setMatches([]);
            } else if ([ "Backspace" ].includes(ev.code)) {
                backChar();
            } else if ([ "Space" ].includes(ev.code)) {
                appendToken();
            } else if ([ "Enter" ].includes(ev.code) && matches.length === 1) {
                onEnterSingle(matches[0])();
            } else if ("`1234567890-=qwertyuiop[]\\asdfghjkl;'zxcvbnm,./!@#$%^&*()_+{}|:\"<>?".includes(ev.key.toLowerCase())) {
                appendChar(ev.key);
            }
        };

        window.addEventListener("keydown", onKey);

        return () => {
            window.removeEventListener("keydown", onKey);
        };
    }, [ clearSequence, appendChar, appendToken, backChar, onEnterSingle, matches, setMatches ]);

    React.useEffect(() => {
        setMatches(matches);
        console.log(sequence, matches);
    }, [ matches, setMatches, pairs ]);

    return <></>;
}