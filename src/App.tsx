import * as React from "react";
import styles from "./styles.module.scss";
import classnames from "classnames";

interface Carpool {
  identifier: string;
  info: string;
}

const startingData: Carpool[] = [
  // {
  //   identifier: "107",
  //   info: "Adam T, Muhammad S, Kiehm D"
  // },
  // {
  //   identifier: "023",
  //   info: "Charlotte H, Layla H"
  // },
  // {
  //   identifier: "003",
  //   info: "Zack H, Jessie F"
  // },
  // {
  //   identifier: "054",
  //   info: "Theo M, Kathy D"
  // },
  // {
  //   identifier: "233",
  //   info: "Jimmy T, Steve J"
  // },
  // {
  //   identifier: "164",
  //   info: "Cara J, Zang T"
  // }
];

const startingPendings = startingData.map((_, index) => index);

export const App = () => {
  const [all, setAll] = React.useState<Carpool[]>(startingData);
  const [pendings, setPendings] = React.useState<number[]>(startingPendings);
  const [readys, setReadys] = React.useState<number[]>([]);
  const [dones, setDones] = React.useState<number[]>([]);

  const moveToPending = React.useCallback(
    (index: number) => () => {
      setPendings([index, ...pendings.filter((i) => i !== index)]);
      setReadys(readys.filter((i) => i !== index));
      setDones(dones.filter((i) => i !== index));
    },
    [pendings, readys, dones]
  );

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
      setPendings(pendings.filter((i) => i !== index));
      setReadys(readys.filter((i) => i !== index));
      setDones([index, ...dones.filter((i) => i !== index)]);
    },
    [pendings, readys, dones]
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
    () => readys.map((i) => ({ ...allSorted[i], index: i })),
    [allSorted, readys]
  );
  const displayedDones = React.useMemo(
    () =>
      allSorted
        .map((data, index) => ({ ...data, index }))
        .filter((_, index) => dones.includes(index)),
    [allSorted, dones]
  );

  React.useEffect(() => {
    const handler = (event : ClipboardEvent) => {
      event.preventDefault();
    
      if (!all.length || window.confirm("Reset with the data from the clipboard?")) {
        console.log(event.clipboardData?.getData("text/plain"));

        setAll(startingData);
        setPendings(startingPendings);
        setReadys([]);
        setDones([]);
      }
    }

    window.document.body.addEventListener("paste", handler);
    
    return () => { 
      window.document.body.removeEventListener("paste", handler);
    }
  }, [ setAll ]);

  return (
    <div className={classnames(styles.app)}>
      <h3>Mrs. Hillis' Carpoolers</h3>
      {
      !all.length
      ? <div>Gimme some data</div>
      : <div className={classnames(styles.columns)}>
      <div>
        <h1>Pending</h1>
        <div className={classnames(styles.cardContainer)}>
          {displayedPendings.map((p) => (
            <div>
              <div
                className={classnames(styles.card)}
                onClick={moveToReady(p.index)}
              >
                <div className={classnames(styles.title)}>{p.identifier}</div>
                <div className={classnames(styles.info)}>{p.info}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h1>Ready</h1>
        <div className={classnames(styles.cardContainer)}>
          {displayedReadys.map((p) => (
            <div>
              <div
                className={classnames(styles.card)}
                onClick={moveToDone(p.index)}
              >
                <div className={classnames(styles.title)}>{p.identifier}</div>
                <div className={classnames(styles.info)}>{p.info}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h1>Done</h1>
        <div className={classnames(styles.cardContainer)}>
          {displayedDones.map((p) => (
            <div>
              <div
                className={classnames(styles.card)}
                onClick={moveToPending(p.index)}
              >
                <div className={classnames(styles.title)}>{p.identifier}</div>
                <div className={classnames(styles.info)}>{p.info}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>}
      
    </div>
  );
};
