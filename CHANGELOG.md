# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Released]

### v2.6.1 - 2025-10-19

#### Fixed

- Fixed repeated API calls issue when accessing invalid addresses for user info and menu endpoints
- Fixed ElButton circle mode styles
- Fixed ElSelect keyboard selection issue
- Fixed static routes with parameters redirecting to login page issue

#### Optimized

- Upgraded some dependencies to be compatible with tailwindcss
- Optimized external link menu click selection state
- Added theme color switching feature to authorization pages

---

### v2.6.0 - 2025-10-16

#### Added

- Extended registration and password reset page top component support

#### Optimized

- Optimized streamlined version menu data structure, improved data consistency
- Optimized local development environment network request proxy configuration
- Optimized ElTree component default styles
- Added VsCode recommended plugin related configuration
- Optimized ElDropdown component click trigger mode interaction styles
- Optimized menu filtering logic
- Optimized page switching animation, improved loading speed
- Optimized dark mode text color

#### Fixed

- Fixed static route custom home page path first visit redirecting to login page issue
- Fixed logout briefly jumping to 500 page issue
- Fixed v2.5.9 version home route redirect configuration failure issue
- Fixed v2.5.9 auto-import mechanism causing build exception

#### ⚠️ Important Notice

> This version requires re-login

---

### v2.5.9 - 2025-10-12

#### Code Optimized

- Optimized views file directory, file names, and code
- Added global configuration for useTable pagination request fields (tableConfig.ts)
- Optimized routing configuration to modular structure
- Menu API now uses apifox mock data (set VITE_ACCESS_MODE to backend mode in .env)

---

### v2.5.8 - 2025-09-29

#### Upgraded

- Upgraded core libraries including vue, vite, element-plus

#### Fixed

- Fixed rich text editor fullscreen top bar z-index issue
- Fixed table column sorting component text overflow issue
- Fixed statistics card condition judgment
- Fixed infinite redirect when root path / and HOME_PAGE_PATH are both /

#### Optimized

- Optimized el-tag styles
- Optimized top progress bar color
- Optimized custom theme configuration
- Optimized ElementPlus custom theme issues

#### ⚠️ Important Notice

> Due to dependency upgrades, Node version needs to be upgraded to v20.19.0 or above

---

### v2.5.7 - 2025-09-14

#### Added

- Added ArtForm component

#### Fixed

- Fixed theme switching flicker issue in new Chrome versions

#### Optimized

- Optimized form label height alignment issue
- First screen startup performance optimization

---

### v2.5.6 - 2025-09-06

#### Added

- ArtTableHeader added search button to control top search bar visibility
- Added permission demonstration examples
- Added global error handling framework

#### Optimized

- useTable type inference optimization, no need to manually pass types for type hints
- useTable removeColumn supports multiple data deletion
- useTable auto-recognizes response body with custom configuration (src/utils/table/tableConfig.ts)
- useTable empty data browser warning optimization
- API request code optimization, api.d.ts type optimization
- Optimized ArtTable top button wrapping adaptive issue
- ArtTable pagination component selection style optimization
- ArtTable empty state height fills by default
- ArtButtonMore component added icon and color configuration
- ArtSearchBar label doesn't occupy space when empty
- Table operation column drag prohibits fixed column dragging
- Role management page API integration and code optimization
- Menu management page optimization
- Optimized settings center scroll following issue
- First-level route external link component validation logic optimization
- Optimized map bottom-right drag issue
- Optimized dark mode page refresh white background issue
- Optimized left menu collapse button spacing issue
- Mobile displays left menu logo
- Network request added showSuccessMessage to configure success message display
- Global components use async loading strategy to improve first screen loading performance

#### Fixed

- Fixed bug where batch deleting entire page data doesn't return to previous page
- Fixed dynamic route parameter issues
- Fixed dynamic route configuration first-level route iframe page fullscreen issue

---

### v2.5.5 - 2025-08-17

#### Added

- Added ArtSearchBar component examples
- useTable added excludeParams to exclude certain parameters from requests

#### Refactored

- Refactored ArtSearchBar component, supports more components and form validation

#### Optimized

- useTable column configuration: supports dynamic update capability
- Optimized color picker border radius
- Unified el-radio and el-checkbox sizes
- art-stats-card added decimal places and separator configuration
- Route configuration example optimization
- Advanced table added custom data fetching example
- Optimized path alias type issues
- Local development CORS configuration optimization
- useTable property and method naming optimization
- Login page UI upgrade
- 403, 404, 500 page UI upgrade

#### Fixed

- Fixed multiple rich text editor icon inconsistency issue
- Fixed useTable deleting last entire page data not returning to previous page issue
- Fixed echarts chart data initialization and update browser error
- Network request supports logout on HTTP status code 401
- Optimized network request logout multiple prompt issue

#### Removed

- Removed art-chart-empty component

---

### v2.5.4 - 2025-07-27

#### Added

- Network request headers support custom configuration
- Expand row supports formatter rendering

#### Optimized

- Route registration added component validation

#### Fixed

- Fixed user info API timing issue causing route registration menu rendering error
- Fixed dynamic route validation issue causing iframe not to display
- Fixed reset file syntax error
- Fixed ArtTable data type error
- Fixed map scroll wheel zoom issue

---

### v2.5.3 - 2025-07-20

#### Added

- Added table left-right layout example

#### Refactored

- ArtTable component refactored

#### Upgraded

- Element Plus upgraded to v2.10.2

#### Optimized

- Optimized useTable pagination parameter issue
- Optimized network request example: initialization parameters, pagination carrying parameters
- Optimized search date range parameter handling
- Optimized el-date-picker component border radius
- Optimized el-select component hover style
- Search component and pagination component height reduced
- Optimized login page slider animation interval
- Optimized menu without submenu display issue

#### Fixed

- Fixed ArtTable switching page size executing two requests bug

---

### v2.5.2 - 2025-07-13

#### Added

- Added one-click cleanup script for quick development environment preparation
- useTable hooks support custom pagination field name mapping
- Horizontal menu, mixed menu, double column menu support badge display
- Quick entry supports configuration file mode
- Top bar function supports configuration file mode
- Support custom home page path
- Route supports redirect and other attributes configuration

#### Optimized

- Global event bus mittBus type safety optimization
- Optimized mobile settings container width style
- Optimized login page verification slider text centering effect

#### Fixed

- Fixed table no data header not displaying issue
- Fixed v2.5.0 top progress bar not displaying issue
- Fixed left menu mask abnormal display issue
- Fixed hiding all submenus still showing parent menu issue
- Fixed stylelint causing login page slider style abnormality
- Fixed old mobile device loading positioning issue

---

### v2.5.1 - 2025-07-08

#### Optimized

- el-card and el-table background color consistent with system

#### Fixed

- Fixed first login system loading closing early bug
- Fixed v2.5.0 version causing fullscreen page style z-index too low bug
- Fixed v2.5.0 version causing table expand row collapse bug

---

### v2.5.0 - 2025-07-06 🎉

#### Added

- Added useTable hooks table encapsulation, supports data fetching, transformation, response adaptation, intelligent caching (based on LRU algorithm), error handling, column configuration and slots, pagination control, refresh strategies and other core functions, comprehensively improving development efficiency and user experience

#### Refactored

- Refactored ArtTable, ArtTableHeader, ArtNotification components

#### Upgraded

- Echarts version upgraded to 5.6.0

#### Removed

- Removed CountTo plugin, replaced with ArtCountTo component

#### Fixed

- Fixed menu management search directly modifying pinia data issue
- Fixed route guard loading flicker issue

#### ⚠️ Important Notice

> Recommended upgrade for more efficient and intelligent table development experience

---

### v2.4.2.9 - 2025-07-02

#### Refactored

- Menu layout and top navigation code refactored

#### Optimized

- Optimized mobile menu scroll user experience
- Optimized top menu style issues
- Top menu width adaptive, can display more content, mixed menu supports mouse scroll
- asyncRoutes route configuration auth_mark field changed to authMark
- Removed duplicate components.d.ts file, components.d.ts and auto-imports.d.ts ignored from commits
- Optimized i18n language file loading method, changed from async to sync mode
- Optimized el-pagination size inconsistency issue

#### Fixed

- Fixed mobile lock screen page some browsers unable to unlock bug

---

### v2.4.2.8 - 2025-06-26

#### Fixed

- Fixed v2.4.2.7 version accessing / path showing 404 issue

---

### v2.4.2.7 - 2025-06-25

#### Added

- Route supports fullscreen mode configuration
- Route supports auto-jump to first valid route of menu
- Dynamic route added removeAllDynamicRoutes method for completely clearing all dynamic routes
- Permission custom directive optimization, added role permission directive v-roles for controlling element visibility
- Added tab operation examples

#### Optimized

- CORS request carrying cookie configuration from environment variables, disabled by default
- Some optimizations for SEO and accessibility

#### Fixed

- Fixed login page drag component ArtDragVerify width and color abnormal bug
- Fixed iframe page mixed mode and double column mode abnormal bug
- Optimized lock screen page being penetrated by el-loading bug

---

### v2.4.2.6 - 2025-06-23

#### Refactored

- Refactored form-related components in components/core/forms folder, improved maintainability and consistency
- Refactored ArtBreadcrumb breadcrumb navigation component, optimized logic structure and styles
- Refactored ArtFireworksEffect fireworks effect component, significantly improved rendering performance and animation smoothness

#### Optimized

- Optimized ArtChatWindow and ArtFastEnter component code, improved readability and performance

#### Added

- README documentation added official website link for easy access to project documentation

---

### v2.4.2.5 - 2025-06-22

#### Refactored

- Refactored chart components, optimized code structure and maintainability
- Fine-tuned chart animations and theme color schemes, improved visual consistency

---

### v2.4.2.4 - 2025-06-18

#### Refactored

- ArtMenuRight component refactored
- Components under components/core/cards refactored, code optimized

#### Optimized

- ArtWatermark added type annotations

---

### v2.4.2.3 - 2025-06-18

#### Refactored

- ArtResultPage component refactored

#### Optimized

- ArtTextScroll component code optimization
- ArtException component added type hints
- ArtCutterImg component style optimization, added type definitions
- ArtVideoPlayer component added type definitions

---

### v2.4.2.2 - 2025-06-16

#### Refactored

- Back to top component refactored
- Icon selector component refactored

#### Changed

- System Logo component property changes

---

### v2.4.2.1 - 2025-06-16

#### Refactored

- Banner component refactored and optimized

#### Fixed

- Fixed mixed menu first menu nested menu jump bug

---

### v2.4.2 - 2025-06-14

#### Refactored

- Refactored network request module, enhanced error handling, type safety and multi-language support

#### Added

- Route configuration added activePath active menu path property

#### Optimized

- Guide and column settings multi-language improvement
- Removed invalid code from user list and menu management pages
- Updated technical support link

#### Fixed

- Fixed mobile search bar unable to scroll, iPad page scroll abnormal issue
- Fixed el-dialog enabling draggable property causing custom animation failure issue
- Fixed v2.3.0 local storage refactoring causing login, registration page multi-language settings unable to persist issue
- Fixed table fixed column not working bug
- Fixed infinite redirect when root path / and HOME_PAGE_PATH are both /

#### ⚠️ Important Notice

> This version requires re-login

---

### v2.4.1.1 - 2025-06-07

#### Optimized

- Optimized role management page code
- el-dialog visual effect optimization, supports line configuration
- System theme mode changed from Light to follow system mode

#### Fixed

- Fixed menu management collapse bug
- Fixed table empty data height infinitely growing bug

---

### v2.4.1 - 2025-06-07

#### Added

- Prohibit using developer tools to crack lock screen when locked

#### Optimized

- Improved menu operation responsiveness
- Page entrance animation time reduced by 0.04s
- Echarts chart performance optimization, added visible area initialization, memory leak protection, debounce handling

#### Fixed

- Fixed Echarts chart component not displaying in dialog bug

---

### v2.4.0 - 2025-06-06 🎉

#### Refactored

- Global TypeScript type system refactored, improved type accuracy and maintainability
- Refactored utils toolkit, unified utility method structure, enhanced readability and reusability

#### Added

- utils added form validation and Cookie operation related utility functions
- Page components added defineOptions for explicit component naming
- HTTP request added token expiration auto-handling logic, improved security and user experience

#### Optimized

- Deleted unused utility modules and invalid resources, streamlined project size
- Optimized views page structure, removed redundant page files
- Exception page multi-language support, improved internationalization experience
- Image resources uniformly converted to webp format, overall resource size reduced by about 50%
- Build output reduced by about 1MB, improved loading efficiency

#### ⚠️ Important Notice

> This version requires re-login

---

## Version Guidelines

### Version Number Rules

This project follows [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html):

- **Major**: Incompatible API changes
- **Minor**: Backwards-compatible functionality additions
- **Patch**: Backwards-compatible bug fixes

### Change Types

- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security-related fixes
- **Optimized**: Performance or experience optimizations
- **Refactored**: Code refactoring
- **Upgraded**: Dependency upgrades

### Important Notice Markers

- 🎉 **Major Update**: Versions with important new features
- ⚠️ **Breaking Changes**: Updates requiring special attention for incompatibility
- 🔒 **Security Update**: Versions fixing security vulnerabilities

---

## Contributing

If you want to contribute to the project, please check [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT License](./LICENSE)

---

**Note**: This changelog starts recording from version v2.4.0. For earlier version history, please check Git commit records.
