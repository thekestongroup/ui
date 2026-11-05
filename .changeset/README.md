# Changesets

Every change that affects people using the library needs a changeset:

```sh
pnpm changeset
```

Pick **patch** (bug fix), **minor** (something new, nothing breaks) or
**major** (breaking change: renamed/removed prop, component or token), and
write one line describing the change. Commit the generated file with your
change.

The Release workflow collects these into a "Version Packages" pull request
that bumps the version and writes CHANGELOG.md. Merging that pull request
publishes the release.
