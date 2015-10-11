
;; !!! YOU HAVE TO INSTALL THE AUTO-COMPLEATE PACKAGE !!!
;; To install, open emacs and do: M-x  package-list-packages, this will give you a list, find: auto-complete, mark it with I and press X to install it.
;; !!! YOU HAVE YO DOWNLOAD THE COLOR THEME !!!
;; To download the color theme do: sudo apt-get install emacs-goodies-el



;; AUTO-COMPLEATE:
;; Start package.el with emacs:
(require 'package)
;; Add MELPA to repository list:
(add-to-list 'package-archives '("melpa" . "http://melpa.milkbox.net/packages/"))
;; Initialize package.el:
(package-initialize)

;; !!! YOU HAVE TO INSTALL THE AUTO-COMPLEATE PACKAGE !!!
;; To install, open emacs and do: M-x  package-list-packages, this will give you a list, find: auto-complete, mark it with I and press X to install it.

;; Start auto-complete with emacs:
(require 'auto-complete)
;; Do default config for auto-complete:
(require 'auto-complete-config)
(ac-config-default)



;; Make cursor not blink:
(custom-set-variables
 '(blink-cursor-interval 0.5)
 '(blink-cursor-mode nil))

;; Change font size:
(set-face-attribute 'default nil :height 100)
;; The value is in 1/10pt, so 100 will give you 10pt, etc.
 
;; Add line numbers:
(global-linum-mode 1)



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



;; Load custom color theme on startup:
;; !!! YOU HAVE YO DOWNLOAD THE COLOR THEME !!!
;; To download the color theme do: sudo apt-get install emacs-goodies-el

(require 'color-theme)
(eval-after-load "color-theme"
  '(progn
     (color-theme-initialize)
     (color-theme-hober)
     (add-to-list 'default-frame-alist '(background-color . "#0b0b0b"))))
(custom-set-faces)
