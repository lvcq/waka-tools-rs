import { makeStyles, tokens } from "@fluentui/react-components";

export const useChessboardStyle = makeStyles({
    chessboard: {
        '--chessColor': tokens.colorNeutralBackground1Hover,
        background: `linear-gradient(45deg, var(--chessColor) 25%, transparent 25%),
                        linear-gradient(-45deg, var(--chessColor) 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, var(--chessColor) 75%),
                        linear-gradient(-45deg, transparent 75%, var(--chessColor) 75%)`,
        backgroundSize: '20px 20px', /* 控制棋盘格子大小 */
        backgroundPosition: ' 0 0, 0 10px, 10px -10px, -10px 0px'
    }
})