# VS Code Terminal Optimization
# This file helps speed up shell integration

# Skip global .zshrc in VS Code terminals when possible
if [[ $TERM_PROGRAM == "vscode" ]]; then
    # Fast path for VS Code
    export SKIP_SLOW_INIT=1
fi

# Ensure proper shell integration
if [[ $TERM_PROGRAM == "vscode" ]] && [[ -n $VSCODE_SHELL_INTEGRATION ]]; then
    # Shell integration is already set up by VS Code
    export SHELL_INTEGRATION_READY=1
fi
