import * as React from "react";
import styles from "./styles.module.scss";
import classnames from "classnames";
import { Card } from "./card";
import { Carpool, GimmeData } from "./gimme-data";

export const App = () => {
  const [all, setAll] = React.useState<Carpool[]>([]);
  const [pendings, setPendings] = React.useState<number[]>([]);
  const [readys, setReadys] = React.useState<number[]>([]);
  const [dones, setDones] = React.useState<number[]>([]);

  // const moveToPending = React.useCallback(
  //   (index: number) => () => {
  //     setPendings([index, ...pendings.filter((i) => i !== index)]);
  //     setReadys(readys.filter((i) => i !== index));
  //     setDones(dones.filter((i) => i !== index));
  //   },
  //   [pendings, readys, dones]
  // );

  const moveToReady = React.useCallback(
    (index: number) => () => {
      setPendings(pendings.filter((i) => i !== index));
      setReadys([index, ...readys.filter((i) => i !== index)]);
      setDones(dones.filter((i) => i !== index));
    },
    [pendings, readys, dones]
  );

  const moveToDone = React.useCallback(
    (index: number) => () => {
      // setPendings(pendings.filter((i) => i !== index));
      // setReadys(readys.filter((i) => i !== index));
      // setDones([index, ...dones.filter((i) => i !== index)]);
    },
    [] // [pendings, readys, dones]
  );

  const allSorted = React.useMemo(
    () => [...all].sort((l, r) => l.identifier.localeCompare(r.identifier)),
    [all]
  );

  const displayedPendings = React.useMemo(
    () =>
      allSorted
        .map((data, index) => ({ ...data, index }))
        .filter((_, index) => pendings.includes(index)),
    [allSorted, pendings]
  );

  const displayedReadys = React.useMemo(
    () => readys.map((i) => ({ ...allSorted[i], index: i })).slice(0,19),
    [allSorted, readys]
  );
  
  // const displayedDones = React.useMemo(
  //   () =>
  //     allSorted
  //       .map((data, index) => ({ ...data, index }))
  //       .filter((_, index) => dones.includes(index)),
  //   [allSorted, dones]
  // );

  const onSetData = React.useCallback((data : Carpool[]) => {
    const pendings = data.map((_, index) => index);

    setAll(data);
    setPendings(pendings);
    setReadys([]);
    setDones([]);
  }, []);

  return (
    <div className={classnames(styles.app)}>
      <h3>Mrs. Hillis' Carpoolers</h3>
      {
        !all.length
        ? <GimmeData onSetData={onSetData} />
        : <div className={classnames(styles.columns)}>
            <div>
              <h1>Pending</h1>
              <div className={classnames(styles.cardContainer)}>
                {displayedPendings.map((p) => (<Card
                  onClick={moveToReady(p.index)}
                  identifier={p.identifier}
                  info={p.info}
                  />))}
              </div>
            </div>
            <div>
              <h1>Ready</h1>
              <div className={classnames(styles.cardContainer)}>
                {displayedReadys.map((p) => (<Card
                  onClick={moveToDone(p.index)}
                  identifier={p.identifier}
                  info={p.info}
                  />))}
              </div>
            </div>
            {/* <div>
              <h1>Done</h1>
              <div className={classnames(styles.cardContainer)}>
                {displayedDones.map((p) => (<Card
                  onClick={moveToPending(p.index)}
                  identifier={p.identifier}
                  info={p.info}
                  />))}
              </div>
            </div> */}
          </div>}
    </div>
  );
};
