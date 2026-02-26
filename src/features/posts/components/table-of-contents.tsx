"use client";

import { useEffect, useState } from "react";
import { TocItem } from "remark-flexible-toc";

interface TableOfContentsProps {
  toc: TocItem[];
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "0px 0px -80% 0px",
        threshold: 0.1,
      }
    );

    // toc 항목들의 ID를 기반으로 heading 요소들을 관찰
    const headingElements = toc
      .map((item) => {
        const id = item.href.substring(1); // # 제거
        return document.getElementById(id);
      })
      .filter((el): el is HTMLElement => el !== null);

    headingElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      headingElements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, [toc]);

  if (!toc || toc.length === 0) {
    return null;
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.substring(1); // # 제거
    const element = document.getElementById(targetId);
    
    if (element) {
      element.scrollIntoView({ 
        behavior: "smooth", 
        block: "start" 
      });
    }
  };

  return (
    <nav className="sticky top-24 pr-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
        목차
      </h3>
      <ul className="space-y-1 text-sm">
        {toc.map((item, index) => {
          const targetId = item.href.substring(1); // # 제거
          const isActive = activeId === targetId;
          
          return (
            <li
              key={index}
              style={{
                paddingLeft: `${(item.depth - 1) * 0.75}rem`,
              }}
            >
              <a
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className={`
                  block py-1.5 px-2 transition-colors duration-200
                  ${
                    isActive
                      ? "text-blue-700 dark:text-blue-300 font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }
                `}
              >
                {item.value}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

