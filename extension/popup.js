function render(points, log) {
  document.getElementById("pts").textContent = points;
  document.getElementById("log").innerHTML = log.map(l=>"<li>"+l+"</li>").join("");
}

chrome.storage.sync.get(["ecoPoints","ecoLog"], ({ecoPoints=0,ecoLog=[]})=>{
  render(ecoPoints, ecoLog);
});

document.getElementById("add").addEventListener("click", ()=>{
  chrome.storage.sync.get(["ecoPoints","ecoLog"], ({ecoPoints=0,ecoLog=[]})=>{
    const nextPts = ecoPoints+5;
    const nextLog = ["+5 Sustainable Action", ...ecoLog].slice(0,10);
    chrome.storage.sync.set({ecoPoints:nextPts,ecoLog:nextLog}, ()=>{
      render(nextPts, nextLog);
    });
  });
});
