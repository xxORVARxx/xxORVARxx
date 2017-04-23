
;; !!! YOU HAVE YO DOWNLOAD THE COLOR THEME !!!
;; To download the color theme do: "sudo apt-get install emacs-goodies-el".

;; !!! YOU HAVE TO INSTALL THE AUTO-COMPLEATE PACKAGE !!!
;; To install, first add the MELPA repositoryopen to emacs, (you do it here, in this file)
;; and than do: "M-x  package-list-packages", this will give you a list, 
;; find: "auto-complete", mark it with I and press X to install it.

;; !!! YOU HAVE YO DOWNLOAD THE MINIMAP !!!
;; Download and put into the: "~/.emacs.d/minimap-master" directory.
;; https://github.com/dengste/minimap

;; !!! YOU CAN INSTALL THE NEOTREE PACKAGE !!!
;; Do: "M-x  package-list-packages", this will give you a list, 
;; find: "neotree", mark it with I and press X to install it.
;; To use it, do: "M-x  neotree". (nothing is needed in this file)



;; --- --- ADDITIONAL PACKAGES --- ---
;; Load custom color theme on startup:
;; !!! YOU HAVE YO DOWNLOAD THE COLOR THEME !!!
;; To download the color theme do: sudo apt-get install emacs-goodies-el
(require 'color-theme)
(eval-after-load "color-theme"
  '(progn
     (color-theme-initialize)
     (color-theme-hober)
     (add-to-list 'default-frame-alist '(background-color . "#0b0b0b"))))
(custom-set-faces
 '(minimap-font-face ((t (:height 10 :family "DejaVu Sans Mono"))))
 )



;; AUTO-COMPLEATE:
;; Start package.el with emacs:
(require 'package)
;; Add MELPA to repository list:
(add-to-list 'package-archives '("melpa" . "http://melpa.milkbox.net/packages/"))
;; Initialize package.el:
(package-initialize)

;; !!! YOU HAVE TO INSTALL THE AUTO-COMPLEATE PACKAGE !!!
;; To install, open emacs and do: M-x  package-list-packages, this will give you a list, 
;; find: auto-complete, mark it with I and press X to install it.

;; Start auto-complete with emacs:
(require 'auto-complete)
;; Do default config for auto-complete:
(require 'auto-complete-config)
(ac-config-default)



;; Add MiniMap scroll bar:
;; !!! YOU HAVE YO DOWNLOAD THE MINIMAP !!!
;; Download and put into the: ~/.emacs.d/minimap-master directory.
;; https://github.com/dengste/minimap
(add-to-list 'load-path "~/.emacs.d/minimap-master/")
(require 'minimap)



;; --- --- SET CUSTOM VARIABLES --- ---
;; custom-set-variables was added by Custom.
;; If you edit it by hand, you could mess it up, so be careful.
;; Your init file should contain only one such instance.
;; If there is more than one, they won't work right.
(custom-set-variables
 ;; Make cursor not blink:
 '(blink-cursor-interval 0.5)
 '(blink-cursor-mode nil)

 '(minimap-highlight-line t)
 '(minimap-minimum-width 20)
 '(minimap-mode t)
 '(minimap-recenter-type (quote relative))
 '(minimap-update-delay 0.05)
 '(minimap-width-fraction 0.05)
 '(minimap-window-location (quote right))
 )



;; Window size:
(add-to-list 'default-frame-alist '(height . 30))
(add-to-list 'default-frame-alist '(width . 140))

;; Change font size:
(set-face-attribute 'default nil :height 120)
;; The value is in 1/10pt, so 100 will give you 10pt, etc.
 
;; Add line numbers:
(global-linum-mode 1)

;; Whenever you open .h files, C++-mode will be used, not C-mode.
(add-to-list 'auto-mode-alist '("\\.h\\'" . c++-mode))
(add-to-list 'auto-mode-alist '("\\.as\\'" . c++-mode))

;; Disable the display of scroll bars:
(scroll-bar-mode -1)

;; Disable the menu bar.
(menu-bar-mode -1)

;; Disable the toolbar:
(tool-bar-mode -1)



;; --- --- C++ Syntax Higlighting --- ---
;; See:
;;   https://www.gnu.org/software/emacs/manual/html_node/elisp/Regular-Expressions.html#Regular-Expressions
;;   https://www.gnu.org/software/emacs/manual/html_node/elisp/Faces-for-Font-Lock.html#Faces-for-Font-Lock

;; This is for AngelScript's:  "A@ a;" and "A@[] a;" types:
;;   (iF you are not using AngelScript, you can remove this)
(font-lock-add-keywords 'c++-mode
 `((,(concat
   "\\<[_a-zA-Z][_a-zA-Z0-9]*\\>"       ; Object identifier.
   "\\s *"                              ; Optional white space.
   "\\(?:\\@\\|\\[\\]\\)"               ; The characters: '@' or '[]' must follow.
   "\\s *"                              ; Optional white space.
   "\\(?:\\@\\|\\[\\]\\)*"              ; any number of the characters: '@' and '[]'.
   "\\s *"                              ; Optional white space.
   "\\<\\([_a-zA-Z][_a-zA-Z0-9]*\\)\\>" ; Name identifier.
   "\\s *") 
    (0 'font-lock-type-face t)
    (1 'font-lock-variable-name-face t)
    )))



;; --- --- CLEAN UP EMACS --- ---
;; Avoid splash screens:
(setq inhibit-splash-screen t)

;; Makes *scratch* empty:
(setq initial-scratch-message "")

;; Removes *scratch* from buffer after the mode has been set:
(defun remove-scratch-buffer ()
  (if (get-buffer "*scratch*")
      (kill-buffer "*scratch*")))
(add-hook 'after-change-major-mode-hook 'remove-scratch-buffer)

;; Removes *messages* from the buffer:
(setq-default message-log-max nil)
(kill-buffer "*Messages*")

;; Removes *Completions* from buffer after you've opened a file:
(add-hook 'minibuffer-exit-hook
      '(lambda ()
         (let ((buffer "*Completions*"))
           (and (get-buffer buffer)
                (kill-buffer buffer)))))

;; Don't show *Buffer list* when opening multiple files at the same time:
(setq inhibit-startup-buffer-menu t)

;; Show only one active window when opening multiple files at the same time:
(add-hook 'window-setup-hook 'delete-other-windows)



;; Create an invisible backup directory and make the backups also invisable:
(defun make-backup-file-name (filename)
(defvar backups-dir "./.backups/")
(make-directory backups-dir t)
(expand-file-name
(concat backups-dir "." (file-name-nondirectory filename) "~")
(file-name-directory filename)))
