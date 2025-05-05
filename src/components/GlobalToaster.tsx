import {Toast, ToastBody, Toaster, ToastFooter, ToastTitle, useId, useToastController} from "@fluentui/react-components"
import {ToastHelper, ToastOptions} from "@helpers/ToastHelper"
import {useEffect} from "react"

export function GlobalToaster() {

    const toasterId = useId('toaster')

    const {dispatchToast, dismissToast} = useToastController(toasterId)
    const notify = (options: ToastOptions) => {
        dispatchToast(<Toast>
            {(options.title || options.titleAction) ?
                <ToastTitle action={options.titleAction}>{options.title}</ToastTitle> : null}
            <ToastBody subtitle={options.subtitle}>{options.message}</ToastBody>
            {options.actions ? <ToastFooter>{options.actions}</ToastFooter> : null}
        </Toast>, {
            intent: options.intent ?? 'info',
        })
    }

    useEffect(() => {
        let showSubscription = ToastHelper.toastShow$.subscribe((options) => {
            console.log('show toast', options)
            notify(options)
        })
        let closeSubscription = ToastHelper.toastHide$.subscribe(() => {
            dismissToast(toasterId)
        })
        return () => {
            showSubscription.unsubscribe()
            closeSubscription.unsubscribe()
        }
    }, [])

    return (
        <Toaster toasterId={toasterId}/>
    )
}