
declare const window: {
    InjectedCkb: any
  };

const nexus = {
    async connect() { 
        if (window.InjectedCkb) { 
            try {
                const ckbProvider = await window.InjectedCkb.enable();
                console.log(ckbProvider, "accounts");
                if (ckbProvider) {
                  alert("Need to download nexus wallet");
                  return;
                }
                return ckbProvider
              } catch (error) {
                alert(error);
              }
            const ckbProvider = await window.InjectedCkb.enable();
        } else {
            // Need to download nexus wallet
            console.log("Need to download nexus wallet")
        }
    }
}

export default nexus
