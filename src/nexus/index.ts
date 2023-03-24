
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
            console.log("Need to download nexus wallet")
        }
    }
}

export default nexus
