import { useSnapshot } from "valtio";
import { triggerFetch } from "../../lib/utils";
import { attendeeStore } from "../../stores/attendeeStores";
import { rollCallCreateStore } from "../../stores/rollcallStores"
import { authorizedFetch } from "../../utils/authorizedFetcher";
import { DeleteDialog } from "../dialogs/DeleteDialog";

export function CreateRollCallDialog({ handleSubmit}: {
    handleSubmit: () => void
}) {
    const store = rollCallCreateStore;
    const snap = useSnapshot(store)

    const handleOpen = (open: boolean) => {
        store.opened = open
    }

    return (
        <DeleteDialog open={snap.opened} title={`Are you sure you want to create a new rollcall`}
            descriptions={snap.message}
            handleOnOpenChanged={handleOpen}
            handleSubmit={handleSubmit}

        />

    )
}
