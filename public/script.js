function gerarCarta(valor) {
    console.log(valor);
    const valorSpan = document.getElementById('valor');
    valorSpan.textContent = valor;
    mudarCorDeFundo(valor);
}

function mudarCorDeFundo(valor) {

    let cor;
    let r, g, b = 0;
    if (valor <= 50) {
        r = 255;
        g = Math.floor((valor / 50) * 255);
        b = 0;
    } else {
        r = Math.floor(255 - ((valor - 50) / 50) * 255);
        g = 255;
        b = 0;
    }
    cor = `rgb(${r}, ${g}, ${b})`;

    document.getElementById('cartasContainer').style.backgroundColor = cor;
    document.getElementById('valor').style.color = cor;
}
