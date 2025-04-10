// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="chapter_1.html"><strong aria-hidden="true">1.</strong> chapter_1</a></li><li class="chapter-item expanded "><a href="test.html"><strong aria-hidden="true">2.</strong> test</a></li><li class="chapter-item expanded "><a href="test2.html"><strong aria-hidden="true">3.</strong> test2</a></li><li class="chapter-item expanded affix "><li class="part-title">CS基础</li><li class="chapter-item expanded "><a href="os.html"><strong aria-hidden="true">4.</strong> 操作系统</a></li><li class="chapter-item expanded "><a href="network.html"><strong aria-hidden="true">5.</strong> 计算机网络</a></li><li class="chapter-item expanded "><a href="linux.html"><strong aria-hidden="true">6.</strong> Linux</a></li><li class="chapter-item expanded "><a href="shejimoshi.html"><strong aria-hidden="true">7.</strong> 设计模式</a></li><li class="chapter-item expanded affix "><li class="part-title">Java</li><li class="chapter-item expanded "><a href="javase.html"><strong aria-hidden="true">8.</strong> javase</a></li><li class="chapter-item expanded "><a href="javathread.html"><strong aria-hidden="true">9.</strong> javathread</a></li><li class="chapter-item expanded "><a href="collection.html"><strong aria-hidden="true">10.</strong> collection</a></li><li class="chapter-item expanded "><a href="jvm.html"><strong aria-hidden="true">11.</strong> jvm</a></li><li class="chapter-item expanded affix "><li class="part-title">框架</li><li class="chapter-item expanded "><a href="weifuwu.html"><strong aria-hidden="true">12.</strong> 微服务</a></li><li class="chapter-item expanded "><a href="spring.html"><strong aria-hidden="true">13.</strong> spring</a></li><li class="chapter-item expanded "><a href="protobuff.html"><strong aria-hidden="true">14.</strong> protobuff</a></li><li class="chapter-item expanded "><a href="netty.html"><strong aria-hidden="true">15.</strong> Netty</a></li><li class="chapter-item expanded affix "><li class="part-title">中间件</li><li class="chapter-item expanded "><a href="mysql.html"><strong aria-hidden="true">16.</strong> MySQL</a></li><li class="chapter-item expanded "><a href="mybatis.html"><strong aria-hidden="true">17.</strong> Mybatis</a></li><li class="chapter-item expanded "><a href="redis.html"><strong aria-hidden="true">18.</strong> redis</a></li><li class="chapter-item expanded "><a href="rocketmq.html"><strong aria-hidden="true">19.</strong> rocketmq</a></li><li class="chapter-item expanded affix "><li class="part-title">分布式</li><li class="chapter-item expanded "><a href="fenbushi.html"><strong aria-hidden="true">20.</strong> 分布式</a></li><li class="chapter-item expanded affix "><li class="part-title">软件质量管理</li><li class="chapter-item expanded affix "><li class="part-title">工程设计</li><li class="chapter-item expanded "><a href="nixi.html"><strong aria-hidden="true">21.</strong> nixi</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
