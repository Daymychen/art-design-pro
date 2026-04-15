"""
幂等种子数据脚本
检测空表后插入，已有数据则跳过
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.db.session import SessionLocal
from app.models.user import User
from app.models.role import Role
from app.models.menu import Menu, MenuAuthItem
from app.models.article import Article
from app.models.comment import Comment
from app.models.changelog import Changelog
from app.core.security import hash_password
from datetime import datetime


def parse_dt(s: str) -> datetime:
    """解析各种日期格式"""
    for fmt in ("%Y-%m-%dT%H:%M:%S.%fZ", "%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M", "%Y-%m-%d", "%Y-%-m-%-d"):
        try:
            return datetime.strptime(s, fmt)
        except ValueError:
            continue
    return datetime.now()


def seed():
    db = SessionLocal()
    try:
        _seed_roles(db)
        _seed_users(db)
        _seed_menus(db)
        _seed_articles(db)
        _seed_comments(db)
        _seed_changelogs(db)
    finally:
        db.close()


def _seed_roles(db):
    if db.query(Role).count() > 0:
        return
    roles_data = [
        ("超级管理员", "R_SUPER", "拥有系统全部权限", True),
        ("管理员", "R_ADMIN", "拥有系统管理权限", True),
        ("普通用户", "R_USER", "拥有系统普通权限", True),
        ("财务管理员", "R_FINANCE", "管理财务相关权限", True),
        ("数据分析师", "R_ANALYST", "拥有数据分析权限", False),
        ("客服专员", "R_SUPPORT", "处理客户支持请求", True),
        ("营销经理", "R_MARKETING", "管理营销活动权限", True),
        ("访客用户", "R_GUEST", "仅限浏览权限", False),
        ("系统维护员", "R_MAINTAINER", "负责系统维护和更新", True),
        ("项目经理", "R_PM", "管理项目相关权限", True),
    ]
    for name, code, desc, enabled in roles_data:
        db.add(Role(role_name=name, role_code=code, description=desc, enabled=enabled))
    db.commit()
    print("已插入 10 个角色")


def _seed_users(db):
    if db.query(User).count() > 0:
        return
    r_super = db.query(Role).filter(Role.role_code == "R_SUPER").first()
    r_admin = db.query(Role).filter(Role.role_code == "R_ADMIN").first()
    r_user = db.query(Role).filter(Role.role_code == "R_USER").first()

    users_data = [
        ("admin", 1, "18670001590", "admin@company.com", "总经办", "1", [r_super]),
        ("alexmorgan", 1, "18670001591", "alexmorgan@company.com", "研发部", "1", [r_admin]),
        ("sophiabaker", 1, "17766664444", "sophiabaker@company.com", "电商部", "1", [r_admin]),
        ("liampark", 1, "18670001597", "liampark@company.com", "人事部", "1", [r_user]),
        ("oliviagrant", 0, "18670001596", "oliviagrant@company.com", "产品部", "1", [r_user]),
        ("emmawilson", 0, "18670001595", "emmawilson@company.com", "财务部", "1", [r_user]),
        ("noahevan", 1, "18670001594", "noahevan@company.com", "运营部", "1", [r_user]),
        ("avamartin", 1, "18123820191", "avamartin@company.com", "客服部", "2", [r_user]),
        ("jacoblee", 1, "18670001592", "jacoblee@company.com", "总经办", "3", [r_user]),
        ("miaclark", 0, "18670001581", "miaclark@company.com", "研发部", "4", [r_user]),
        ("ethanharris", 1, "13755554444", "ethanharris@company.com", "研发部", "1", [r_user]),
        ("isabellamoore", 1, "13766660000", "isabellamoore@company.com", "研发部", "1", [r_user]),
        ("masonwhite", 1, "18670001502", "masonwhite@company.com", "研发部", "1", [r_user]),
        ("charlottehall", 1, "13006644977", "charlottehall@company.com", "研发部", "1", [r_user]),
        ("benjaminscott", 0, "13599998888", "benjaminscott@company.com", "研发部", "1", [r_user]),
        ("ameliaking", 1, "13799998888", "ameliaking@company.com", "研发部", "1", [r_user]),
    ]
    pwd = hash_password("123456")
    for username, gender, mobile, email, dep, status, roles in users_data:
        u = User(
            username=username, password_hash=pwd, nick_name=username,
            gender=gender, mobile=mobile, email=email,
            department=dep, status=status, created_by="system",
        )
        u.roles = roles
        db.add(u)
    db.commit()
    print("已插入 16 个用户")


def _seed_menus(db):
    if db.query(Menu).count() > 0:
        return
    r_super = db.query(Role).filter(Role.role_code == "R_SUPER").first()
    r_admin = db.query(Role).filter(Role.role_code == "R_ADMIN").first()

    def add(parent_id, path, name, component, title, icon="", sort=0,
            roles=None, auth_list=None, is_hide=False, is_hide_tab=False,
            keep_alive=False, active_path="", is_iframe=False, link="",
            is_full_page=False, show_text_badge="", fixed_tab=False):
        m = Menu(
            parent_id=parent_id, path=path, name=name, component=component,
            title=title, icon=icon, sort_order=sort, is_hide=is_hide,
            is_hide_tab=is_hide_tab, keep_alive=keep_alive, active_path=active_path,
            is_iframe=is_iframe, link=link, is_full_page=is_full_page,
            show_text_badge=show_text_badge, fixed_tab=fixed_tab,
        )
        if roles:
            m.roles = roles
        db.add(m)
        db.flush()
        if auth_list:
            for a in auth_list:
                db.add(MenuAuthItem(menu_id=m.id, title=a["title"], auth_mark=a["authMark"]))
        return m

    # Dashboard
    dash = add(None, "/dashboard", "Dashboard", "/index/index", "menus.dashboard.title", "ri:pie-chart-line", 1, [r_super, r_admin])
    add(dash.id, "console", "Console", "/dashboard/console", "menus.dashboard.console", "ri:home-smile-2-line", 1, fixed_tab=True)
    add(dash.id, "analysis", "Analysis", "/dashboard/analysis", "menus.dashboard.analysis", "ri:align-item-bottom-line", 2)
    add(dash.id, "ecommerce", "Ecommerce", "/dashboard/ecommerce", "menus.dashboard.ecommerce", "ri:bar-chart-box-line", 3)

    # System
    sys_m = add(None, "/system", "System", "/index/index", "menus.system.title", "ri:user-3-line", 2, [r_super, r_admin])
    add(sys_m.id, "user", "User", "/system/user", "menus.system.user", "ri:user-line", 1, [r_super, r_admin], keep_alive=True)
    add(sys_m.id, "role", "Role", "/system/role", "menus.system.role", "ri:user-settings-line", 2, [r_super], keep_alive=True)
    add(sys_m.id, "user-center", "UserCenter", "/system/user-center", "menus.system.userCenter", "ri:user-line", 3, is_hide=True, is_hide_tab=True, keep_alive=True)
    add(sys_m.id, "menu", "Menus", "/system/menu", "menus.system.menu", "ri:menu-line", 4, [r_super], keep_alive=True,
        auth_list=[{"title": "新增", "authMark": "add"}, {"title": "编辑", "authMark": "edit"}, {"title": "删除", "authMark": "delete"}])
    nested = add(sys_m.id, "nested", "Nested", "", "menus.system.nested", "ri:menu-unfold-3-line", 5, keep_alive=True)
    add(nested.id, "menu1", "NestedMenu1", "/system/nested/menu1", "menus.system.menu1", "ri:align-justify", 1, keep_alive=True)
    nested2 = add(nested.id, "menu2", "NestedMenu2", "", "menus.system.menu2", "ri:align-justify", 2, keep_alive=True)
    add(nested2.id, "menu2-1", "NestedMenu2-1", "/system/nested/menu2", "menus.system.menu21", "ri:align-justify", 1, keep_alive=True)
    nested3 = add(nested.id, "menu3", "NestedMenu3", "", "menus.system.menu3", "ri:align-justify", 3, keep_alive=True)
    add(nested3.id, "menu3-1", "NestedMenu3-1", "/system/nested/menu3", "menus.system.menu31", "", 1, keep_alive=True)
    nested32 = add(nested3.id, "menu3-2", "NestedMenu3-2", "", "menus.system.menu32", "", 2, keep_alive=True)
    add(nested32.id, "menu3-2-1", "NestedMenu3-2-1", "/system/nested/menu3/menu3-2", "menus.system.menu321", "", 1, keep_alive=True)

    # Article
    art = add(None, "/article", "Article", "/index/index", "menus.article.title", "ri:book-2-line", 3, [r_super, r_admin])
    add(art.id, "article-list", "ArticleList", "/article/list", "menus.article.articleList", "ri:article-line", 1, keep_alive=True,
        auth_list=[{"title": "新增", "authMark": "add"}, {"title": "编辑", "authMark": "edit"}])
    add(art.id, "detail/:id", "ArticleDetail", "/article/detail", "menus.article.articleDetail", "", 2, is_hide=True, keep_alive=True, active_path="/article/article-list")
    add(art.id, "comment", "ArticleComment", "/article/comment", "menus.article.comment", "ri:mail-line", 3, keep_alive=True)
    add(art.id, "publish", "ArticlePublish", "/article/publish", "menus.article.articlePublish", "ri:telegram-2-line", 4, keep_alive=True,
        auth_list=[{"title": "发布", "authMark": "add"}])

    # Examples
    ex = add(None, "/examples", "Examples", "/index/index", "menus.examples.title", "ri:sparkling-line", 4)
    perm = add(ex.id, "permission", "Permission", "", "menus.examples.permission.title", "ri:fingerprint-line", 1)
    add(perm.id, "switch-role", "PermissionSwitchRole", "/examples/permission/switch-role", "menus.examples.permission.switchRole", "ri:contacts-line", 1, keep_alive=True)
    add(perm.id, "button-auth", "PermissionButtonAuth", "/examples/permission/button-auth", "menus.examples.permission.buttonAuth", "ri:mouse-line", 2, keep_alive=True,
        auth_list=[{"title": "新增", "authMark": "add"}, {"title": "编辑", "authMark": "edit"}, {"title": "删除", "authMark": "delete"},
                   {"title": "导出", "authMark": "export"}, {"title": "查看", "authMark": "view"}, {"title": "发布", "authMark": "publish"},
                   {"title": "配置", "authMark": "config"}, {"title": "管理", "authMark": "manage"}])
    add(perm.id, "page-visibility", "PermissionPageVisibility", "/examples/permission/page-visibility", "menus.examples.permission.pageVisibility", "ri:user-3-line", 3, [r_super], keep_alive=True)
    add(ex.id, "tabs", "Tabs", "/examples/tabs", "menus.examples.tabs", "ri:price-tag-line", 2)
    add(ex.id, "tables/basic", "TablesBasic", "/examples/tables/basic", "menus.examples.tablesBasic", "ri:layout-grid-line", 3, keep_alive=True)
    add(ex.id, "tables", "Tables", "/examples/tables", "menus.examples.tables", "ri:table-3", 4, keep_alive=True)
    add(ex.id, "forms", "Forms", "/examples/forms", "menus.examples.forms", "ri:table-view", 5, keep_alive=True)
    add(ex.id, "form/search-bar", "SearchBar", "/examples/forms/search-bar", "menus.examples.searchBar", "ri:table-line", 6, keep_alive=True)
    add(ex.id, "tables/tree", "TablesTree", "/examples/tables/tree", "menus.examples.tablesTree", "ri:layout-2-line", 7, keep_alive=True)
    add(ex.id, "socket-chat", "SocketChat", "/examples/socket-chat", "menus.examples.socketChat", "ri:shake-hands-line", 8, keep_alive=True)

    # Template
    tpl = add(None, "/template", "Template", "/index/index", "menus.template.title", "ri:apps-2-line", 5)
    add(tpl.id, "cards", "Cards", "/template/cards", "menus.template.cards", "ri:wallet-line", 1)
    add(tpl.id, "banners", "Banners", "/template/banners", "menus.template.banners", "ri:rectangle-line", 2)
    add(tpl.id, "charts", "Charts", "/template/charts", "menus.template.charts", "ri:bar-chart-box-line", 3)
    add(tpl.id, "map", "Map", "/template/map", "menus.template.map", "ri:map-pin-line", 4, keep_alive=True)
    add(tpl.id, "chat", "Chat", "/template/chat", "menus.template.chat", "ri:message-3-line", 5, keep_alive=True)
    add(tpl.id, "calendar", "Calendar", "/template/calendar", "menus.template.calendar", "ri:calendar-2-line", 6, keep_alive=True)
    add(tpl.id, "pricing", "Pricing", "/template/pricing", "menus.template.pricing", "ri:money-cny-box-line", 7, keep_alive=True, is_full_page=True)

    # Widgets
    wid = add(None, "/widgets", "Widgets", "/index/index", "menus.widgets.title", "ri:apps-2-add-line", 6)
    add(wid.id, "icon", "Icon", "/widgets/icon", "menus.widgets.icon", "ri:palette-line", 1, keep_alive=True)
    add(wid.id, "image-crop", "ImageCrop", "/widgets/image-crop", "menus.widgets.imageCrop", "ri:screenshot-line", 2, keep_alive=True)
    add(wid.id, "excel", "Excel", "/widgets/excel", "menus.widgets.excel", "ri:download-2-line", 3, keep_alive=True)
    add(wid.id, "video", "Video", "/widgets/video", "menus.widgets.video", "ri:vidicon-line", 4, keep_alive=True)
    add(wid.id, "count-to", "CountTo", "/widgets/count-to", "menus.widgets.countTo", "ri:anthropic-line", 5)
    add(wid.id, "wang-editor", "WangEditor", "/widgets/wang-editor", "menus.widgets.wangEditor", "ri:t-box-line", 6, keep_alive=True)
    add(wid.id, "watermark", "Watermark", "/widgets/watermark", "menus.widgets.watermark", "ri:water-flash-line", 7, keep_alive=True)
    add(wid.id, "context-menu", "ContextMenu", "/widgets/context-menu", "menus.widgets.contextMenu", "ri:menu-2-line", 8, keep_alive=True)
    add(wid.id, "qrcode", "Qrcode", "/widgets/qrcode", "menus.widgets.qrcode", "ri:qr-code-line", 9, keep_alive=True)
    add(wid.id, "drag", "Drag", "/widgets/drag", "menus.widgets.drag", "ri:drag-move-fill", 10, keep_alive=True)
    add(wid.id, "text-scroll", "TextScroll", "/widgets/text-scroll", "menus.widgets.textScroll", "ri:input-method-line", 11, keep_alive=True)
    add(wid.id, "fireworks", "Fireworks", "/widgets/fireworks", "menus.widgets.fireworks", "ri:magic-line", 12, keep_alive=True, show_text_badge="Hot")
    add(wid.id, "/outside/iframe/elementui", "ElementUI", "", "menus.widgets.elementUI", "ri:apps-2-line", 13, is_iframe=True, link="https://element-plus.org/zh-CN/component/overview.html")

    # Result
    res = add(None, "/result", "Result", "/index/index", "menus.result.title", "ri:checkbox-circle-line", 7)
    add(res.id, "success", "ResultSuccess", "/result/success", "menus.result.success", "ri:checkbox-circle-line", 1, keep_alive=True)
    add(res.id, "fail", "ResultFail", "/result/fail", "menus.result.fail", "ri:close-circle-line", 2, keep_alive=True)

    # Exception
    exc = add(None, "/exception", "Exception", "/index/index", "menus.exception.title", "ri:error-warning-line", 8)
    add(exc.id, "403", "Exception403", "/exception/403", "menus.exception.forbidden", "", 1, keep_alive=True, is_hide_tab=True, is_full_page=True)
    add(exc.id, "404", "Exception404", "/exception/404", "menus.exception.notFound", "", 2, keep_alive=True, is_hide_tab=True, is_full_page=True)
    add(exc.id, "500", "Exception500", "/exception/500", "menus.exception.serverError", "", 3, keep_alive=True, is_hide_tab=True, is_full_page=True)

    # Safeguard
    safe = add(None, "/safeguard", "Safeguard", "/index/index", "menus.safeguard.title", "ri:shield-check-line", 9)
    add(safe.id, "server", "SafeguardServer", "/safeguard/server", "menus.safeguard.server", "ri:hard-drive-3-line", 1, keep_alive=True)

    # ChangeLog
    add(None, "/change/log", "ChangeLog", "/change/log", "menus.plan.log", "ri:gamepad-line", 10)

    db.commit()
    print("已插入菜单数据")


def _seed_articles(db):
    if db.query(Article).count() > 0:
        return
    admin = db.query(User).filter(User.username == "admin").first()
    articles_data = [
        ("42", "Node.js + Docker自动化部署", 56, "2024-08-26T00:00:00.000Z", "Node.js",
         "本章将介绍 Node.js 使用 Docker 、Webhook 自动化部署、蓝绿部署、项目到服务器。"),
        ("36", "HTTP 协议", 109, "2024-02-22T00:00:00.000Z", "浏览器",
         "概念HTTP（hypertext transport protocol）协议；中文叫超文本传输协议。"),
        ("40", "MongoDB 数据库基本操作", 66, "2023-11-30T00:00:00.000Z", "MongoDB",
         "MongoDB 是一个基于分布式文件存储的数据库。"),
        ("40", "Mac os 安装 MongoDB", 59, "2023-11-15T00:00:00.000Z", "MongoDB",
         "下载MongoDB安装包，官网下载地址。"),
        ("42", "npm、yarn、nrm 常用命令", 91, "2023-11-07T00:00:00.000Z", "Node.js",
         "设置镜像源，淘宝镜像源，腾讯云镜像源。"),
        ("42", "Node.js 包管理工具", 53, "2023-10-31T00:00:00.000Z", "Node.js",
         "包是什么？包管理工具是一个通用的概念。"),
        ("42", "Node.js 模块化", 40, "2023-10-25T00:00:00.000Z", "Node.js",
         "将一个复杂的程序文件依据一定规则拆分成多个文件的过程。"),
        ("42", "Node.js学习笔记", 198, "2023-10-15T00:00:00.000Z", "Node.js",
         "fs 模块，文件系统，是 Node.js 中的内置模块。"),
        ("41", "最好用的ChatGPT应用", 78, "2023-05-22T00:00:00.000Z", "GPT",
         "目前为止最好用的ChatGPT网站，支持6种AI模型。"),
        ("35", "Nuxt 百度收录 robots 和 sitemap", 109, "2023-04-07T00:00:00.000Z", "Nuxt",
         "robots 和 sitemap 文件，前者减少百度蜘蛛的无谓爬取。"),
        ("12", "Vue3+TS+Vite 项目搭建笔记（更新中）", 516, "2023-04-03T00:00:00.000Z", "Vue",
         "本章会教你在真实项目中如何搭建 VueRouter、Vuex、pinia、axios。"),
        ("9", "CSS 根据系统自动切换主题方案", 184, "2023-04-01T00:00:00.000Z", "CSS",
         "原理是改变 css 变量 + window.matchMedia 来监听系统主题变化。"),
        ("36", "浏览器-安全", 116, "2023-03-28T00:00:00.000Z", "浏览器",
         "同源策略、跨站脚本攻击（xss）、跨域请求伪造（CSRF）。"),
        ("12", "Vue-Router4", 135, "2023-02-08T00:00:00.000Z", "Vue",
         "路由模式构建 router.ts。"),
        ("10", "Event Loop（事件循环）", 161, "2023-01-03T00:00:00.000Z", "JavaScript",
         "js是单线程的，一次只能执行一段代码。"),
    ]
    cover_urls = [f"/covers/img{i}.webp" for i in range(1, 11)]
    for i, (blog_class, title, count, dt, type_name, brief) in enumerate(articles_data):
        db.add(Article(
            title=title, blog_class=blog_class, view_count=count,
            type_name=type_name, home_img=cover_urls[i % len(cover_urls)],
            brief=brief,
            author_id=admin.id if admin else None,
            created_at=parse_dt(dt),
        ))
    db.commit()
    print("已插入 15 篇文章")


def _seed_comments(db):
    if db.query(Comment).count() > 0:
        return
    # 留言墙评论
    wall_data = [
        ("2024-09-03", "发现了一个超级好用的工具，开心", "匿名"),
        ("2024-09-03", "今天的代码写得很顺利！", "Coder123"),
        ("2024-09-04", "遇到个bug，调试了一整天", "DebugMaster"),
        ("2024-09-04", "学Node真的是一件很有趣的事", "NodeLover"),
        ("2024-09-05", "今天的进度有点慢，需要加把劲了", "努力中的小白"),
        ("2024-09-05", "太好了，终于解决了一个难题！", "匿名"),
        ("2024-09-06", "学会了新的Node技巧，开心！", "开心每一天"),
        ("2024-09-06", "代码优化真的是一个细致活", "精益求精"),
        ("2024-09-07", "今天的工作太顺利了，完美！", "完美主义者"),
        ("2024-09-07", "需要多练习，才能掌握更多技能", "匿名"),
        ("2024-09-08", "每天进步一点点，终会成功", "逐梦者"),
        ("2024-09-08", "与其抱怨，不如努力改变", "改变命运"),
        ("2024-09-09", "今天尝试了新的库，感觉不错", "新手尝试"),
        ("2024-09-09", "写代码也需要灵感，今天灵感不错", "灵感源泉"),
        ("2024-09-10", "感谢社区的帮助，让我解决了问题", "受益匪浅"),
        ("2024-09-10", "学习的路上要保持耐心和恒心", "匿名"),
        ("2024-09-11", "今天学习了异步编程的知识，受益匪浅", "异步学习者"),
        ("2024-09-11", "今天的代码质量提升了不少", "代码匠人"),
        ("2024-09-12", "感觉学习编程真的很有成就感", "成就感满满"),
        ("2024-09-12", "要加倍努力，才能超越昨天的自己", "努力超越"),
        ("2024-09-13", "今天的代码写得很顺手，继续保持", "顺风顺水"),
        ("2024-09-13", "写代码也需要创意，今天很有创意", "创意无限"),
        ("2024-09-14", "遇到的难题解决了，感觉很有成就感", "匿名"),
        ("2024-09-14", "今天的编程练习很有收获", "收获满满"),
        ("2024-09-15", "学习编程的路上，有苦有甜", "苦乐编程"),
        ("2024-09-15", "今天的代码写得特别流畅，开心！", "流畅编程"),
        ("2024-09-16", "今天的编程练习让我更有信心", "信心满满"),
        ("2024-09-16", "今天的编程学习让我收获很多", "匿名"),
        ("2024-09-17", "编程是一门艺术，今天体会到了", "编程艺术家"),
        ("2024-09-17", "今天的代码写得很顺利，继续加油！", "匿名"),
    ]
    for date_str, content, author in wall_data:
        db.add(Comment(author=author, content=content, created_at=parse_dt(date_str)))

    # 文章详情嵌套评论
    first_article = db.query(Article).first()
    aid = first_article.id if first_article else None

    c1 = Comment(article_id=aid, author="白夜", content="黑神话悟空的打斗场面真的燃爆了！期待上线！", created_at=parse_dt("2024-09-04 09:00"))
    db.add(c1)
    db.flush()
    c101 = Comment(article_id=aid, parent_id=c1.id, author="星河", content="是啊，特别是那些技能特效，简直帅炸！", created_at=parse_dt("2024-09-04 09:15"))
    db.add(c101)
    db.flush()
    db.add(Comment(article_id=aid, parent_id=c101.id, author="光芒", content="希望优化能跟上，不然这么好的画面如果卡顿就可惜了。", created_at=parse_dt("2024-09-04 09:30")))

    c2 = Comment(article_id=aid, author="浮生", content="据说黑神话悟空需要很高的配置，不知道我的电脑能不能跑起来。", created_at=parse_dt("2024-09-04 10:00"))
    db.add(c2)
    db.flush()
    c102 = Comment(article_id=aid, parent_id=c2.id, author="晨曦", content="同担心啊，听说需要至少RTX 3070才能高效运行。", created_at=parse_dt("2024-09-04 10:20"))
    db.add(c102)
    db.flush()
    db.add(Comment(article_id=aid, parent_id=c102.id, author="流光", content="我是打算升级配置，等这款游戏就是了。", created_at=parse_dt("2024-09-04 10:40")))

    c3 = Comment(article_id=aid, author="风铃", content="130GB的存储要求有点夸张啊，不过画质这么好，也情有可原。", created_at=parse_dt("2024-09-04 11:00"))
    db.add(c3)
    db.flush()
    c103 = Comment(article_id=aid, parent_id=c3.id, author="云端", content="确实有点高，不过为了这种品质的游戏，值得。", created_at=parse_dt("2024-09-04 11:15"))
    db.add(c103)
    db.flush()
    db.add(Comment(article_id=aid, parent_id=c103.id, author="梦境", content="希望发售后能优化一下安装包体积。", created_at=parse_dt("2024-09-04 11:30")))

    db.commit()
    print("已插入评论数据（留言墙 30 条 + 嵌套评论 9 条）")


def _seed_changelogs(db):
    if db.query(Changelog).count() > 0:
        return
    logs = [
        ("v3.0.2", "问题修复、表单与路由体验优化", "2026-03-15",
         ["修复：富文本编辑器样式异常问题", "修复：菜单区域无法滚动的问题", "修复：特殊路由打开后显示空白页面的问题",
          "修复：WebSocket 重连异常问题", "修复：特殊动态路由参数处理异常问题",
          "优化：ArtForm、ArtSearchBar 表单提交前增加数据清洗", "修复：ArtTable 与 ElForm 组合使用时动态表单校验错误的问题",
          "修复：隐藏子菜单时父级菜单被一并隐藏的问题", "修复：静态路由刷新后跳回首页的问题",
          "修复：art-table 属性继承异常问题", "修复：PC 端切换到移动端后再切回 PC 端菜单无法恢复"], False, ""),
        ("v3.0.1", "bug修复、新增功能", "2025-11-15",
         ["修复：路由注册时不存在接口的重复请求问题", "修复：一键精简脚本打包失败的问题",
          "优化：完善路由配置验证机制", "新增：ArtForm 和 ArtSearchBar 组件支持自定义渲染",
          "新增：iconify 新增离线图标加载模式", "新增：退出登录重新进入系统保留用户标签页",
          "新增：双列菜单新增折叠按钮", "新增：WebSocket 连接"], False, ""),
        ("v3.0.0", "Sass重构为Tailwind CSS，Iconfont替换为Iconify", "2025-11-9",
         ["样式系统重构：Sass 全面迁移至 Tailwind CSS", "图标方案升级：Iconfont 替换为 Iconify",
          "构建优化：完整包体积减少 1.3 MB", "路由注册重构：全面重构路由注册系统",
          "架构优化：优化目录结构", "性能提升：优化核心代码逻辑", "设计系统：重构颜色体系"],
         True, "重要提示：本次升级涉及样式系统与图标库的底层重构，属于破坏性更新。"),
        ("v2.6.1", "bug修复、授权页增加主题色切换功能", "2025-10-19",
         ["修复获取用户信息接口重复调用问题", "升级部分依赖兼容 tailwindcss", "授权页增加主题色切换功能"], False, ""),
        ("v2.6.0", "代码优化、bug修复", "2025-10-16",
         ["优化精简版本菜单数据结构", "优化本地开发环境网络请求代理配置", "优化菜单过滤逻辑", "优化页面切换动画"], True, ""),
        ("v2.5.9", "代码优化", "2025-10-12",
         ["views 文件目录优化", "useTable 分页请求字段增加全局配置", "优化路由配置为模块化结构"], False, ""),
        ("v2.5.0", "新增 useTable hooks 表格封装", "2025-07-06",
         ["重构 ArtTable、ArtTableHeader 组件", "新增 useTable hooks 表格封装",
          "修复菜单管理搜索直接修改 pinia 数据的问题", "Echarts 版本升级到 5.6.0"], False, "建议升级"),
        ("v2.4.2", "Bug修复与体验优化", "2025-06-14",
         ["重构网络请求模块", "修复移动端搜索栏无法滚动问题", "路由配置新增 activePath 属性"], True, ""),
        ("v2.4.0", "代码重构与资源优化", "2025-06-06",
         ["全局 TypeScript 类型体系重构", "重构 utils 工具包",
          "图片资源统一转换为 webp 格式", "打包产物减少约 1MB"], True, ""),
    ]
    for version, title, date, detail, require_re_login, remark in logs:
        db.add(Changelog(
            version=version, title=title, date=date,
            detail=detail, require_re_login="true" if require_re_login else "false",
            remark=remark,
        ))
    db.commit()
    print("已插入 9 条更新日志")


if __name__ == "__main__":
    seed()
    print("种子数据初始化完成")
