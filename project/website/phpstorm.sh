#!/bin/bash

echo $1

/cygdrive/c/Program\ Files\ \(x86\)/JetBrains/PhpStorm\ 2016.3.2/bin/phpstorm64.exe $(cygpath -aw $1)

