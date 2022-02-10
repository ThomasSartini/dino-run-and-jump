$v =  Get-Volume | Where-Object -FilterScript {$_.FileSystemLabel -eq 'Thomas'}
$v = $v.DriveLetter
$v += ":/i3bb/MIODINO/dino-run-and-jump"
cd $v
git add .
write-host "Titolo"
$titolo = read-host
git commit -m "$titolo"
git push
Start-Sleep -s 1