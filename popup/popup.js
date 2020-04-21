chrome.storage.sync.get("probs_list", function(result){
    if (result && result.probs_list) {
        str = "Total problems monitored: " + result.probs_list.length + "<br/><br/>";
        setInterval(updatePopup, 1000);

        function updatePopup() {
            pstr = "";
            for (let i=0; i < result.probs_list.length; i++) {
                pstr += result.probs_list[i].code + " : " + result.probs_list[i].name + " : ";
                pstr += ((Date.now() - result.probs_list[i].init_ts)/1000) + "<br />";
            }
            document.getElementById("main").innerHTML = str + pstr;
        }
    }

    console.dir(result);
    console.dir(result.probs_list);
});