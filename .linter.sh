#!/bin/bash
cd /home/kavia/workspace/code-generation/imagefusion-95535-d9f42533/image_processing_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

