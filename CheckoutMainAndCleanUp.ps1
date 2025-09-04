git checkout main
git pull
$branches = git branch | Where-Object { $_.Trim() -ne "main" } | ForEach-Object { $_.Trim() }
foreach ($branch in $branches) {
    git branch -D $branch
}