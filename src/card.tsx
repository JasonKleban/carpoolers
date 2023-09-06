import * as React from "react";
import styles from "./styles.module.scss";
import classnames from "classnames";

interface CardProps {
    onClick?: React.MouseEventHandler<HTMLDivElement>
    identifier: string
    info: string
}

export const Card = ({ onClick, identifier, info }: CardProps) =>
    <div>
        <div
            className={classnames(styles.card)}
            onClick={onClick}
            title={`${identifier} :: ${info}`}
        >
            <div className={classnames(styles.title)}>{identifier}</div>
            <div className={classnames(styles.info)}>{info}</div>
        </div>
    </div>;