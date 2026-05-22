# Disable headline letter animations
s/.headline-letter {/.headline-letter {\n    display: inline;\n    position: static;\n    opacity: 1 !important;\n    transform: translateY(0) !important;\n    will-change: auto;\n    animation: none !important;\n}/
# Disable motion trail
s/.motion-trail {/.motion-trail {\n    position: relative;\n    isolation: isolate;\n    transition: none;\n}/
