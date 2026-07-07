# -*- coding: utf-8 -*-
import webbrowser, sys, os
base = os.path.dirname(os.path.abspath(__file__))
if len(sys.argv) > 1 and sys.argv[1] == 'teacher':
    webbrowser.open(os.path.join(base, 'teacher.html'))
else:
    webbrowser.open(os.path.join(base, 'index.html'))
