<!--
  When editing this file keep in mind to:
  * Prefer clear English sentences to short abbreviations.
  * Keep the sections sorted in the same order:
    1. Breaking changes
    2. Enhancements
    3. Bug fixes
    4. Documentation
  * Put all unreleased changes in the top level "Unreleased" section.
-->

# Changelog

All notable changes to this project will be documented here.

This project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 0.2.0 (June 26, 2018)

### Breaking changes

- Renamed `DropDown` to `Dropdown`.

### Enhancements

- Create `Select` component.
- The prop `Responsive.screenSizes` is now optional.
- Add `Dropdown.placement`.
- `toInnerRef` doesn't passes the `innerRef` if `ref` is falsy.

### Documentation

- Update documentation of `Responsive`, `ClickOutside`, `Dropdown`, `MergeRefs`.

## 0.1.0 (June 6, 2018)

### Enhancements

- Create `ClickOutside` component.
- Create `DropDown` component.
- Create `MergeRefs` component.
- Create `Responsive` component.
- Create `getDisplayName` function.
- Create `getOtherProps` function.
- Create `renderMethods` function.
- Create `setRef` function.
- Create `toInnerRef` function.