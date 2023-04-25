
# Fix corrupted NTFS volume on linux


The error looks like this, when you try to mount your drive:

```
Unable to access "USB NAME"

Error mounting /dev/sdc2 ad /media/username/usbname: Unknown error when mounting /dev/sdc2
```

Notice the `/dev/sdc2`, this is id device on local system.

We will reuse it to run `ntfsfix`

```shell
sudo ntfsfix /dev/sdc2
[sudo] password for username: 
Mounting volume... $MFTMirr does not match $MFT (record 0).
FAILED
Attempting to correct errors... 
Processing $MFT and $MFTMirr...
Reading $MFT... OK
Reading $MFTMirr... OK
Comparing $MFTMirr to $MFT... FAILED
Correcting differences in $MFTMirr record 0...OK
Processing of $MFT and $MFTMirr completed successfully.
Setting required flags on partition... OK
Going to empty the journal ($LogFile)... OK
Checking the alternate boot sector... OK
NTFS volume version is 3.1.
NTFS partition /dev/sdc2 was processed successfully.
```

If the operation finishes with "processed successfully", you should be able to access your NTFS drive now


# What is the cause

Probably Bad unmount/eject, issue with your usb ports as well can be a cause

