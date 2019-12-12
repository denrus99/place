import timeout from "./timeout.mjs";
import drawer from "./drawer.mjs";
import picker from "./picker.mjs";

document.querySelector("#start").addEventListener("submit", e => {
    e.preventDefault();
    main(new FormData(e.currentTarget).get("apiKey"));
    document.querySelector(".container").classList.add("ready");
});

const main = apiKey => {
    const ws = connect(apiKey);
    ws.addEventListener("message", (message) => {
      const obj = JSON.parse(message.data);
        if(obj.type === 'put'){
          drawer.put(obj.payload.x,obj.payload.y,obj.payload.color)
        } else{
          drawer.putArray(JSON.parse(message.data).payload.place);
        }
    });

    timeout.next = new Date();
    drawer.onClick = (x, y) => {
        //drawer.put(x, y, picker.color);
        let mes = {
          type: "put",
          payload: {
            x,
            y,
            color: picker.color,
          }
        }
        ws.send(JSON.stringify(mes));
    };
};

const connect = apiKey => {
    const url = `${location.origin.replace(/^http/, "ws")}?apiKey=${apiKey}`;
    return new WebSocket(url);
};
