let cha_ids = [];

on("ready", function() {
    let cha_id = findObjs({type:"character"});
    for (var i=0; i<cha_id.length; i++) {
        let ctrlby = cha_id[i].get('controlledby');
        if (!playerIsGM(ctrlby) && ctrlby.length > 0) {
            let id = cha_id[i].get('_id')
            cha_ids.push(id);
        }
    }
});

on("chat:message", function(msg) {
    if(msg.type === "api" && msg.content === "!!daypassed"){
        if(cha_ids.length > 0) {
            for (i in cha_ids) {
                let cha_san = JSON.parse(JSON.stringify(findObjs({type:"attribute", name:"san", characterid:cha_ids[i]})[0]));
                let cha_sanCurrent = cha_san.current;
                let cha_sanStart = findObjs({type:"attribute", name:"san_start", characterid:cha_ids[i]});
                if (cha_sanStart[0] === undefined) {
                    cha_name = findObjs({type:"character", _id:cha_ids[i]});
                    chaObj = JSON.parse(JSON.stringify(cha_name))
                    sendChat("system", `/w gm ${chaObj[0].name} 캐릭터의 '하루 시작 이성치'가 비어 있습니다. 작성한 후 다시 !!daypassed 명령어를 실행해 주세요.`)
                    return;
                } else {
                    cha_sanStart[0].set({"current" : cha_sanCurrent});
                }
            }
            text = "하루 시작 이성치가 초기화 되었습니다."
        } else {
            text = "플레이어 캐릭터가 없습니다."
        }
        sendChat("system", `/w gm ${text}`);
    }
});

on("change:attribute", function(obj) {
    if(obj.get("name")==="san") {
        const cha_id = obj.get('_characterid');
        const cha_sanStart = findObjs({type:"attribute", name:"san_start", characterid:cha_id})[0].get("current");
        const cha_startIndefInsane = Math.floor((cha_sanStart/5)*4);
        let ch_attr = obj.get('current');
        let cha = getObj('character', cha_id);
        let ctrlby = cha.get('controlledby');
        if (ch_attr <= cha_startIndefInsane && (!playerIsGM(ctrlby) && ctrlby != "")) {
            let cha_name = cha.get('name');
            sendChat(cha_name, "**장기적 광기가 발동됩니다**");
        }
    }
});