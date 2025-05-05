import { Input, InputProps, Label, makeStyles, tokens, useId } from "@fluentui/react-components";

interface TextFieldProps extends InputProps {
    label?: string,
}

const useStyles = makeStyles({
    field: {
        display: "grid",
        gridRowGap: tokens.spacingVerticalXXS,
        marginTop: tokens.spacingVerticalMNudge,
        padding: tokens.spacingHorizontalMNudge,
    }
})

export function TextField({ label, ...props }: TextFieldProps) {
    const id = useId('textfield')
    const styles = useStyles()
    return (
        <div className={styles.field}>
            <Label htmlFor={id}>{label}</Label>
            <Input appearance="underline" id={id} {...props} />
        </div>
    )
}