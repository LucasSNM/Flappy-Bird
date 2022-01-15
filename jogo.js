console.log('Flappy Bird!!!')

const sprites = new Image()
sprites.src = './sprites.png'
const sprites_flappy = new Image()
sprites_flappy.src = './flappy.png'

const canvas = document.querySelector('canvas')
const contexto = canvas.getContext('2d')

// Função que faz o draw iamge e rotaciona a imagem de acordo com o grau passado
const drawImageRot = (ctx, img, width, height, x, y, deg) => {
  ctx.save()
  const rad = deg * Math.PI / 180;
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(rad);
  ctx.drawImage(img, width / 2 * (-1), height / 2 * (-1), width, height);
  ctx.restore();
}

// [Plano de Fundo]
const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  desenha() {
    contexto.fillStyle = '#70c5ce';
    contexto.fillRect(0, 0, canvas.width, canvas.height)

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );
  },
};

/// [mensagemGetReady]
const mensagemGetReady = {
  sX: 134,
  sY: 0,
  w: 174,
  h: 152,
  x: (canvas.width / 2) - 174 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGetReady.sX, mensagemGetReady.sY,
      mensagemGetReady.w, mensagemGetReady.h,
      mensagemGetReady.x, mensagemGetReady.y,
      mensagemGetReady.w, mensagemGetReady.h
    );
  }
}

// [Chao]
function criaChao() {
  return chao;
}
const chao = {
  spriteX: 0,
  spriteY: 610,
  largura: 224,
  altura: 112,
  x: 0,
  y: canvas.height - 112,
  atualiza() {
    const movimentoDoChao = 1;
    const repeteEm = chao.largura / 2;
    const movimentacao = chao.x - movimentoDoChao;

    // console.log('[chao.x]', chao.x);
    // console.log('[repeteEm]',repeteEm);
    // console.log('[movimentacao]', movimentacao % repeteEm);

    chao.x = movimentacao % repeteEm;
  },
  desenha() {
    contexto.drawImage(
      sprites,
      chao.spriteX, chao.spriteY,
      chao.largura, chao.altura,
      chao.x, chao.y,
      chao.largura, chao.altura,
    );

    contexto.drawImage(
      sprites,
      chao.spriteX, chao.spriteY,
      chao.largura, chao.altura,
      (chao.x + chao.largura), chao.y,
      chao.largura, chao.altura,
    );
  },
};

function fazColisao(flappyBird, chao) {
  const flappyBirdY = flappyBird.y + flappyBird.altura
  const chaoY = chao.y

  if (flappyBirdY >= chaoY) return true
  else return false
}

const flappyBird = {
  sourceX: 0,
  sourceY: 0,
  largura: 33,
  altura: 24,
  x: 10,
  y: 50,
  velocidade: 0,
  gravidade: 0.25,
  angulo: 0,
  voa: 5,

  atualiza() {
    if (fazColisao(flappyBird, chao)) {
      mudaParaTela(Telas.INICIO)
      return
    }
    flappyBird.y = flappyBird.y + flappyBird.velocidade
    flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade
    if (flappyBird.angulo <= 90 && flappyBird.angulo >= -20) {
      flappyBird.angulo = flappyBird.angulo + 0.8 * flappyBird.velocidade 
      if(flappyBird.angulo>90)flappyBird.angulo=90
      if(flappyBird.angulo<-20)flappyBird.angulo=-20
    }
  },
  pula() {
    if (flappyBird.y > 16) {
      flappyBird.velocidade = -flappyBird.voa
    }
  },

  // movimentos: [
  //     { spriteX: 0, spriteY: 0, }, // asa pra cima
  //     { spriteX: 0, spriteY: 26, }, // asa no meio 
  //     { spriteX: 0, spriteY: 52, }, // asa pra baixo
  //     { spriteX: 0, spriteY: 26, }, // asa no meio 
  //   ],
  reinicia() {
    flappyBird.x = 10,
      flappyBird.y = 50,
      flappyBird.velocidade = 0,
      flappyBird.gravidade = 0.25,
      flappyBird.angulo = 0,
      flappyBird.voa = 5
  },
  desenha() {
    drawImageRot(
      contexto,
      sprites_flappy,
      // flappyBird.sourceX, flappyBird.sourceY, // Sprite X, Sprite Y
      flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
      flappyBird.x, flappyBird.y,
      // flappyBird.largura, flappyBird.altura,
      flappyBird.angulo,
    )
  }
}


//
// TELAS
//
let telaAtivo = {};
function mudaParaTela(novaTela) {
  telaAtivo = novaTela
}
const Telas = {
}
Telas.INICIO = {
  desenha() {
    Telas.JOGO.desenha()
    mensagemGetReady.desenha()
  },
  atualiza() {

  },
  click() {
    flappyBird.reinicia()
    mudaParaTela(Telas.JOGO)
  }
}
Telas.JOGO = {
  desenha() {
    planoDeFundo.desenha()
    chao.desenha()
    flappyBird.desenha()
  },
  atualiza() {
    flappyBird.atualiza()
  },
  click() {
    flappyBird.pula()
  }
}


//
// FIM TELAS
//

function loop() {
  telaAtivo.desenha()
  telaAtivo.atualiza()

  requestAnimationFrame(loop)
}

window.addEventListener('click', function () {
  if (telaAtivo.click) {
    telaAtivo.click()
  }
})

mudaParaTela(Telas.INICIO)
loop()
