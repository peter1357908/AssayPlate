# AssayPlate
Plan experiments with this Assay Plate web app!

This is primarily a MERN stack demo that showcases many common features of a full-stack app (responsive frontend, stateless authentication, public API, etc.). I summarized my learnings from building this demo [on my website](https://peterish.com/programming/full-stack-dev-note-MERNs/).

## Notable Features:

Frontend:
1. user authentication -- each user can save multiple plates to the cloud.
1. common editing features including input validation, unsaved changes warning and restoration to previous save.
1. intuitive, reactive GUI
    - draggable assay plate (allows editing big plates on smaller screens)
    - invalid input is allowed when editing for planning purposes
    - mobile friendly in landscape (soon in portrait, too)

Backend:
1. more input validation! *Comprehensive* input validation... hopefully.

## API

Users can edit and save multiple plates at once through interfacing with our API. [Postman](https://web.postman.co/) works great!

API documentation is available [here](./server/README.md)
