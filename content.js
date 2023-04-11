function waitLoad() {
    // iframe要素が読み込まれるまで待つ
    const jsInitCheckTimer = setInterval(jsLoaded, 1000);

    function jsLoaded() {
        let iframeEl = document.getElementById("main-frame-if");
        let iframeDocument = iframeEl.contentDocument || iframeEl.contentWindow.document;
    
        // 読み込まれた後の処理
        if (iframeDocument.querySelector("input.ui-button") != null) {
            clearInterval(jsInitCheckTimer);

            let backButton = iframeDocument.querySelector("input.ui-button");
            keyHandler(iframeDocument, document, backButton);
        }
    }
}

function keyHandler(innerDocument, outerDocument, backButton) {
    // キーハンドラー登録（iframe内のdocumentと外側のdocumentどちらにも登録する必要がある（マウスフォーカスしてる方がよばれる））
    [innerDocument, outerDocument].forEach((document) => {
        document.addEventListener("keydown", (event) => {
            if (event.metaKey && event.key === 'ArrowLeft') {
                event.preventDefault();
                backButton.click();
            }
        }
        , true);
    })

}

// iframe要素を監視する
function hadnlePage() {
    let iframeEl = document.getElementById("main-frame-if");
    observer.observe(iframeEl, {
        attributes: true
    });
}

isIframeDisplay = false;

// Mutaion Observerインスタンスを立てる
const observer = new MutationObserver(mutationsList => {
    for(const mutation of mutationsList) {

        // 掲示板詳細へアクセスした時の処理
        if (mutation.target.style.display === 'inline' && !isIframeDisplay) {
            isIframeDisplay = true;
            waitLoad();
        }

        // 掲示板一覧へアクセスした時の処理
        if (mutation.target.style.display === 'none' && isIframeDisplay) {
            isIframeDisplay = false;
        }
    }
})

window.addEventListener("load", hadnlePage, false);
