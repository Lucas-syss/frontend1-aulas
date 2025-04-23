class ProgressCircle extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['progress'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'progress') {
            this.render();
        }
    }

    get progress() {
        return parseFloat(this.getAttribute('progress')) || 0;
    }

    

    render() {
        const progress = this.progress;
        

        this.shadowRoot.innerHTML = `
            <style>
                .progress-circle {
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    top: 10px;
                    left: 10px;
                    border-radius: 50%;
                    background: conic-gradient(#4caf50 calc(${progress} * 1%), #ddd 0);
                }

                .progress-circle::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 0%;
                    height: 0%;
                    background-color: white;
                    border-radius: 50%;
                }
            </style>
            <div class="progress-circle"></div>
        `;
    }
}

customElements.define('progress-circle', ProgressCircle);
