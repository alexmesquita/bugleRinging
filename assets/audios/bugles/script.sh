#! /bin/bash

for f in *.mp3*;
    do
        mv -v "$f" "`echo $f | tr '[A-Z]' '[a-z]'`";
        mv "$f" "${f/Ã/a}";
        mv "$f" "${f/Á/a}";
        mv "$f" "${f/É/e}";
        mv "$f" "${f/Ê/e}";
        mv "$f" "${f/Õ/o}";
        mv "$f" "${f/Â/a}";
        mv "$f" "${f/Í/i}";
        mv "$f" "${f/Ú/u}";
        mv "$f" "${f/ú/u}";
    done