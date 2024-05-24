let cha_ids = [];

on("ready", function () {
    const cha_id = findObjs({type: "character"});
    for (let i = 0; i < cha_id.length; i++) {
        const ctrlby = cha_id[i].get('controlledby');
        if (!playerIsGM(ctrlby) && ctrlby.length > 0) {
            cha_ids.push(cha_id[i].get('_id'));
        }
    }
});

on("chat:message", function (msg) {
    if (msg.type === "api") {
        if (msg.content === "!!daypassed") {
            let check = false;
            for (let i = 0; i < cha_ids.length; i++) {
                const cha_san = findObjs({type: "attribute", name: "san", characterid: cha_ids[i]});
                const cha_sanStart = findObjs({type: "attribute", name: "san_start", characterid: cha_ids[i]});
                const cha_sanCurrent = cha_san[0].get("current");
                cha_sanStart[0].set("current", cha_sanCurrent);
                check = true;
            }
            check === true ? text = "/w gm 하루가 지났습니다. 하루 시작 이성치가 초기화 되었습니다." : text = "/w gm daypassed API를 실행하지 못했습니다.";
            sendChat("system", text);
        }
    }
});

on("change:attribute", function (obj) {
    if (obj.get("name") === "san") {
        const cha_id = obj.get('_characterid');
        const cha_sanStart = findObjs({type: "attribute", name: "san_start", characterid: cha_id})[0].get("current");
        const cha_startIndefInsaneNum = Math.floor((cha_sanStart / 5) * 4);
        const cha_attr = obj.get('current');
        const cha = getObj('character', cha_id);
        const cha_ctrlby = cha.get('controlledby');
        if (cha_attr <= cha_startIndefInsaneNum && (!playerIsGM(cha_ctrlby) && cha_ctrlby !== "")) {
            const cha_name = cha.get('name');
            sendChat(cha_name, "장기적 광기가 발동됩니다");
        }
    }
});