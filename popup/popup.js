chrome.storage.sync.get("probs_list", function(result){
    if (result && result.probs_list) {
        str = "Total problems monitored: " + result.probs_list.length + "<br/>";
        for (let i=0; i < result.probs_list.length; i++) {
            str += result.probs_list[i].code + ":" + result.probs_list[i].name + "<br/>";
        }
        document.getElementById("main").innerHTML = str;
    }

    console.dir(result);
    console.dir(result.probs_list);
});