 const audio = document.getElementById('music');
    audio.play().catch(() => {
      document.addEventListener('click', () => audio.play(), { 
        once: true 
                                                             });
    });
