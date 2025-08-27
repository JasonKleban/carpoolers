import * as React from "react";
import styles from "./styles.module.scss";
import classnames from "classnames";
import { Card } from "./card";
import { Carpool, GimmeData } from "./gimme-data";
import { KeyMonitor } from "./key-monitor";

export const App = () => {
  const [sequence, setSequence] = React.useState<string[]>([]);
  const [all, setAll] = React.useState<Carpool[]>([]);
  const [pendings, setPendings] = React.useState<number[]>([]);
  const [readys, setReadys] = React.useState<number[]>([]);
  const [matches, setMatches] = React.useState<number[]>([]);

  const moveToPending = React.useCallback(
    (index: number) => () => {
      setPendings([index, ...pendings.filter((i) => i !== index)]);
      setReadys(readys.filter((i) => i !== index));
      setSequence([]);
    },
    [pendings, readys]
  );

  const moveToReady = React.useCallback(
    (index: number) => () => {
      setPendings(pendings.filter((i) => i !== index));
      setReadys([index, ...readys.filter((i) => i !== index)]);
      setSequence([]);
    },
    [pendings, readys]
  );

  // const toggleIndex = React.useCallback(
  //   (index: number) => () => {
  //     if (pendings.includes(index)) {
  //       moveToReady(index);
  //     } else if (readys.includes(index)) {
  //       moveToPending(index);
  //     }
  //   },
  //   []
  // );

  const allSorted = React.useMemo(
    () => [...all].sort((l, r) => l.identifier.localeCompare(r.identifier)),
    [all]
  );

  const searchable = React.useMemo(
    () => 
      allSorted
      .flatMap(({ parts }, index) => 
        parts.map(phrase => ({ phrase, index })))
      .reduce((acc, { phrase, index }) => ({
          ...acc,
          [phrase]: [ ...acc[phrase] ?? [], index ]
        }), 
        {} as { [phrase : string] : number[] }), 
    [ allSorted ]);

  const hasFilter = React.useMemo(() =>
    sequence.some(p => !!p.length), 
    [sequence]);

  const displayedPendings = React.useMemo(
    () =>
      allSorted
        .map((data, index) => ({ ...data, index }))
        .filter((_, index) => pendings.includes(index) && (!hasFilter || matches.includes(index))),
    [allSorted, pendings, matches, hasFilter]
  );

  const displayedReadys = React.useMemo(
    () => readys
      .map((i) => ({ ...allSorted[i], index: i })).slice(0,16),
    [allSorted, readys, matches]
  );

  const onSetData = React.useCallback((data : Carpool[]) => {
    const pendings = data.map((_, index) => index);

    setAll(data);
    setPendings(pendings);
    setReadys([]);
    setSequence([]);
  }, []);

  const oneMatch = React.useMemo(() => matches.length === 1 ? matches[0] : undefined, [ matches ]);

  const showSequence = React.useMemo(() => 
    hasFilter 
    ? sequence.toReversed().join(" ") 
    : "", [ hasFilter, sequence ]);

  return (
    <div className={classnames(styles.app)}>
      <h3>TGES Carpoolers</h3>
      <div className={styles.filter}>{showSequence}</div>
      {
        !all.length
        ? <GimmeData onSetData={onSetData} />
        : <div className={classnames(styles.columns)}>
            <KeyMonitor
              searchable={searchable}
              sequence={sequence}
              setSequence={setSequence}
              setMatches={setMatches}
              onEnterSingle={moveToReady} />
            <div>
              <h2>Pending</h2>
              <div className={classnames(styles.cardContainer)}>
                {displayedPendings.map((p) => (<Card
                  key={p.index}
                  onClick={moveToReady(p.index)}
                  identifier={p.identifier}
                  info={p.info}
                  highlight={p.index === oneMatch} />))}
              </div>
            </div>
            <div>
              <h2>Ready</h2>
              <div className={classnames(styles.cardContainer)}>
                {displayedReadys.map((p) => (<Card
                  key={p.index}
                  onClick={moveToPending(p.index)}
                  identifier={p.identifier}
                  info={p.info}
                  highlight={p.index === oneMatch}
                  />))}
              </div>
            </div>
          </div>}
    </div>
  );
};
