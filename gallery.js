document.addEventListener('DOMContentLoaded', () => 
{
    const galleries = document.querySelectorAll('.gallery');
    
    galleries.forEach(gallery => 
    {
        const display = gallery.querySelector('.gallery-display');
        const items = gallery.querySelectorAll('.gallery-item');
        const thumbs = gallery.querySelectorAll('.thumb');

        if (!display || !items.length || !thumbs.length) return;
        
        function showItem(index)
        {
            items.forEach(item => 
            {
                item.classList.remove('active');
                
                if (item.tagName === 'VIDEO') 
                {
                    item.pause();
                }
            });

            const itemToShow = display.querySelector(`[data-index="${index}"]`);
            if (itemToShow) 
            {
                itemToShow.classList.add('active');
            }
            
            thumbs.forEach(thumb => 
            {
                thumb.classList.remove('active');
            });
            
            const activeThumb = gallery.querySelector(`.thumb[data-index="${index}"]`);
            if (activeThumb) 
            {
                activeThumb.classList.add('active');
            }
        }

        thumbs.forEach(thumb => 
        {
            thumb.addEventListener('click', () => 
            {
                const index = parseInt(thumb.getAttribute('data-index'));
                showItem(index);
            });
        });
    });
});