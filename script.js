document.addEventListener('DOMContentLoaded', () => {

    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.calculator button');
    let hasError = false;

    const operators = ['+', '-', '*', '/'];

    function isOperator(char) {
        return operators.includes(char);
    }

    function resetIfError() {
        if (hasError) {
            display.value = '';
            hasError = false;
        }
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;

            if (value === 'CE') {
                display.value = '';
                hasError = false;
                return;
            }

            if (value === '=') {
                try {
                    if (/\/0(?!\.)/.test(display.value)) {
                        throw new Error('Divide by zero');
                    }

                    display.value = eval(display.value);
                } catch {
                    display.value = 'ERROR';
                    hasError = true;
                }
                return;
            }

            resetIfError();

            const lastChar = display.value.slice(-1);

            // Prevent starting with invalid operator
            if (display.value === '' && isOperator(value) && value !== '-') {
                return;
            }

            // Prevent consecutive operators
            if (isOperator(lastChar) && isOperator(value)) {
                return;
            }

            display.value += value;
        });
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        const key = e.key;

        if (key === 'Escape') {
            display.value = '';
            hasError = false;
            return;
        }

        if (key === 'Enter') {
            e.preventDefault();
            try {
                display.value = eval(display.value);
            } catch {
                display.value = 'ERROR';
                hasError = true;
            }
            return;
        }

        if (key === 'Backspace') {
            display.value = display.value.slice(0, -1);
            return;
        }

        if (/[0-9().]/.test(key)) {
            resetIfError();
            display.value += key;
        }

        if (operators.includes(key)) {
            resetIfError();
            const lastChar = display.value.slice(-1);
            if (display.value === '' && key !== '-') return;
            if (isOperator(lastChar)) return;
            display.value += key;
        }
    });

});
