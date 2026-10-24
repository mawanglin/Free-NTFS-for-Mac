# Intel (x64) 构建分支说明

上游自 v1.5.x 起只发布 arm64 版本，本分支 `intel-x64` 仅新增 `.github/` 下的文件，用于在 fork 中自动打包 x64 版本，不修改任何上游代码。

## 分支约定

- `main`：与上游 `hoochanlon/Free-NTFS-for-Mac` 保持一致，不做任何改动
- `intel-x64`：`main` + 本目录与 `.github/workflows/build-x64.yml`

## 同步上游

```bash
git fetch upstream
git checkout main && git merge --ff-only upstream/main && git push github main
git checkout intel-x64 && git merge main && git push github intel-x64
```

推送 `intel-x64` 后自动构建；若该上游版本尚未发布过 x64 版本，则自动发布 Release。

## 版本号

发布版本 = 上游版本 + 小版本，例如上游 `1.5.4` 对应 `v1.5.4.1`、`v1.5.4.2`。
同一上游版本需要重新发布时，在 Actions 页面手动运行 “Build Intel (x64)” 即可，小版本自动递增。

> 本地 `upstream` remote 已禁用 push，请勿向上游仓库提交 PR。
