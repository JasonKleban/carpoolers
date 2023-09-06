import * as React from "react";
import styles from "./styles.module.scss";
import classnames from "classnames";

export interface Carpool {
    identifier: string;
    info: string;
}

export interface GimmeDataProps {
    onSetData: (data: Carpool[]) => void;
}

const ordinals : { [key : number]: string } = {
    1: "1st",
    2: "2nd",
    3: "3rd",
    4: "4th",
    5: "5th"
};

export const GimmeData = ({ onSetData }: GimmeDataProps) => {
    React.useEffect(() => {
        const handler = (event: ClipboardEvent) => {
            event.preventDefault();

            const textData = event.clipboardData?.getData("text/plain");

            const parsed = textData?.split('\n')
                .map(line => line.split('\t')
                    .map(cell => cell.trim()));

            const rows = parsed?.length ?? 0;

            const columns = parsed?.reduce(([min, max], { length }) =>
                [
                    Math.min(min, length),
                    Math.max(max, length)
                ] as const, [Infinity, 0 as number] as const) ?? [0, 0];

            if (parsed && 
                0 < rows && 
                columns[0] === columns[1] && 
                columns[0] === 5) {

                const grouped = new Map<string, string[]>();

                parsed.forEach(([car, first, last, grade, teacher]) => {
                    const gradeth = ordinals[+grade] ?? grade;
                    const optionals = [teacher, gradeth].filter(i => i !== "");

                    grouped.set(car, [ 
                        ...(grouped.get(car) ?? []), 
                        optionals.length 
                            ? `${first} ${last} (${optionals.join(" ")})`
                            : `${first} ${last}`
                    ])
                });

                const padNumbers = Array.from(grouped.keys())
                    .reduce((max, n) => 
                        Math.max(max, 
                            Number.isInteger(+n) 
                            ? `${+n}`.length
                            : 0),
                        0);

                const loaded = Array.from(grouped.entries()).map(([ car, infos ]) => ({
                    identifier: Number.isInteger(+car) ? `${+car}`.padStart(padNumbers, '0') : car,
                    info: infos.join(", ")
                }));

                onSetData(loaded);
            }
        }

        window.document.body.addEventListener("paste", handler);

        return () => {
            window.document.body.removeEventListener("paste", handler);
        }
    }, [ onSetData ]);

    return (<div>
        <div>&nbsp;</div>
        <div>Gimme some data</div>
        <div>&nbsp;</div>
        <i>Please paste in your five cells wide selection from the spreadsheet
            of Vehicle, Student First Name, Student Last Name, Grade and Teacher Name.
        </i>
    </div>);
}