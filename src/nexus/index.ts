
declare const window: {
    ckb: any
};

const nexus = {
    async connect() {
        if (window.ckb) {
            // const isEnabled = await window.ckb.isEnabled()
            try {
                const ckbProvider = await window.ckb.enable();
                if (!ckbProvider) {
                    alert("Need to download nexus wallet");
                    return;
                }
                return ckbProvider
            } catch (error) {
                alert(error);
            }
        } else {
            // Need to download nexus wallet
            console.error("Need to download nexus wallet")
        }
    },
    async getLiveCells() {
        const nexusWallet = await nexus.connect();
        let liveCellsResult = await nexusWallet.fullOwnership.getLiveCells({});
        let fullCells = liveCellsResult.objects;

        while (liveCellsResult.objects.length === 20) {
            liveCellsResult = await nexusWallet.fullOwnership.getLiveCells({
                cursor: liveCellsResult.cursor,
            });
            fullCells.push(...liveCellsResult.objects);
        }

        return fullCells
    }
}

export default nexus
