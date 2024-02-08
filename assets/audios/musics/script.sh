#! /bin/bash

for f in *.mpeg*;
    do
        # mv -v "$f" "`echo $f | tr '[A-Z]' '[a-z]'`";
        # mv "$f" "${f/Ã/a}";
        # mv "$f" "${f/À/a}";
        # mv "$f" "${f/Ã/a}";
        # mv "$f" "${f/Á/a}";
        # mv "$f" "${f/ã/a}";
        # mv "$f" "${f/à/a}";
        # mv "$f" "${f/ã/a}";
        # mv "$f" "${f/á/a}";
        # mv "$f" "${f/É/e}";
        # mv "$f" "${f/Ê/e}";
        # mv "$f" "${f/é/e}";
        # mv "$f" "${f/ê/e}";
        # mv "$f" "${f/Í/i}";
        # mv "$f" "${f/í/i}";
        # mv "$f" "${f/Ó/o}";
        # mv "$f" "${f/Õ/o}";
        # mv "$f" "${f/ó/o}";
        # mv "$f" "${f/õ/o}";
        # mv "$f" "${f/Ú/u}";
        # mv "$f" "${f/ú/u}";
        # mv "$f" "${f/ç/c}";
        # mv "$f" "${f/\ /_}";
        # mv "$f" "${f/_+/_}";

        ffmpeg -i "$f" 2>&1 | grep Duration
    done
