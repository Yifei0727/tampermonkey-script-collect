// ==UserScript==
// @name         Baidu搜索过滤垃圾网站
// @namespace    https://github.com/yifei0727/tampermonkey-script-collect
// @version      0.1
// @description  屏蔽特定的垃圾聚合网站的展示避免点进去浪费时间
// @author       @Yifei0727
// @match        https://www.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @run-at       document-body
// ==/UserScript==

(function () {
    'use strict';
    const black_sites = [
        'www.shuzhiduo.com',
        'www.bbsmax.com',
        'xfm.xnknkj.cn',
        //todo more 待完善
    ];

    console.log("black-site-filter running ...");

    /**
     * 判断url是否是黑名单中的网站
     * @param url {string} url地址或者域名
     * @returns {boolean} 是否是黑名单中的网站 true是 false不是
     */
    function is_black_site(url) {
        return black_sites.filter(site => {
            let reg = new RegExp("http(s)?://([^/]*)" + site + ".*");
            return reg.test(url.toLowerCase());
        }).length > 0;
    }

    document.addEventListener("DOMContentLoaded", function () {
        let observer = new MutationObserver(() => {
            Array.from(document.getElementsByClassName("result c-container")).filter(ele => {
                // 如果有mu属性，直接判断
                let mu = ele.attributes.getNamedItem('mu');
                if (mu !== undefined && mu !== null && is_black_site(mu.value)) {
                    return true;
                }
                // 如果没有mu属性，判断data-url属性
                let rowEle = ele.getElementsByClassName("c-row OP_LOG_LINK");
                if (rowEle.length > 0) {
                    let data_url = rowEle[0].parentNode.lastElementChild.attributes.getNamedItem('data-url');
                    if (data_url !== undefined && data_url !== null && is_black_site(data_url.value)) {
                        return true;
                    }
                }
                return false;
            }).forEach(ele => {
                //ele.remove(); //使用隐藏 而不是删除
                if (ele.style.display !== "none") {
                    console.log("隐藏黑名单链接:" + ele.textContent.trim());
                    ele.style.display = "none";
                }
            });
        });
        observer.observe(document.body, {childList: true, subtree: true});
        console.log("black-site-filter registered");
    });
})();