document.addEventListener("DOMContentLoaded", function () {
    const content = document.querySelector(".content");
    const headings = content.querySelectorAll("h2, h3");

    if (headings.length === 0) return;

    const tocWrapper = document.createElement("div");
    tocWrapper.className = "floating-toc-wrapper";

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "📑 展开目录";
    toggleBtn.className = "toc-toggle-btn";
    tocWrapper.appendChild(toggleBtn);

    const toc = document.createElement("nav");
    toc.className = "floating-toc hidden";
    toc.innerHTML = "<h2>目录</h2>";
    const list = document.createElement("ul");

    const headingMap = [];

    headings.forEach((heading) => {
        if (!heading.id) {
            heading.id = heading.textContent.trim().toLowerCase().replace(/\s+/g, "-");
        }

        const li = document.createElement("li");
        li.className = heading.tagName.toLowerCase();
        li.innerHTML = `<a href="#${heading.id}">${heading.textContent}</a>`;
        list.appendChild(li);

        headingMap.push({ id: heading.id, element: heading, li: li });
    });

    toc.appendChild(list);
    tocWrapper.appendChild(toc);
    document.body.appendChild(tocWrapper);

    // 切换显示目录
    toggleBtn.addEventListener("click", () => {
        toc.classList.toggle("hidden");
        const expanded = !toc.classList.contains("hidden");
        toggleBtn.textContent = expanded ? "📕 收起目录" : "📑 展开目录";
        content.style.maxWidth = expanded ? "calc(100% - 320px)" : "";
    });

    // 滚动高亮逻辑
    window.addEventListener("scroll", () => {
        let current = null;
        headingMap.forEach(({ element, li }) => {
            const top = element.getBoundingClientRect().top;
            if (top < 160) {
                current = li;
            }
        });

        headingMap.forEach(({ li }) => li.classList.remove("active"));
        if (current) {
            current.classList.add("active");

            // 滚动浮动目录区域内的当前项进入可视区域
            const container = toc.querySelector("ul");
            const rect = current.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            if (rect.top > containerRect.top || rect.bottom < containerRect.bottom) {
                               
                current.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
            }
        }
    });
});
