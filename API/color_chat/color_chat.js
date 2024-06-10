on("chat:message", function(msg){
    if (msg.type == "api" && msg.content.startsWith("! ")){
        let character = findObjs({type:'character', name:msg.who});
        if (character.length > 0) {
            chat_id = "character|" + character[0].get('_id');
        } else {
            chat_id = "player|" + msg.playerid;
        }
        let content = msg.content.substring(2, msg.content.length)
        let color = getObj('player', msg.playerid).get("color")
        sendChat(chat_id, `<span style="color:${color}">${content}</span>`);
    }
});