// Simple renderer for speakers data
async function loadSpeakers() {
  try {
    const res = await fetch('/data/speakers.json');
    if (!res.ok) throw new Error('Failed to load speakers data');
    const speakers = await res.json();

    const sponsorsEl = document.querySelector('.sponsors');
    if (!sponsorsEl) return;

    // Create section title container
    const sectionTitle = document.createElement('div');
    sectionTitle.className = 'section-title text-center mb-10 md:mb-[30px] mt-[50px] md:mt-10';
    
    const heading = document.createElement('h2');
    heading.className = 'text-[2.2rem] md:text-xl text-primary-dark relative inline-block mb-[15px] md:mb-3 font-semibold leading-tight md:leading-[1.3] after:content-[\'\'] after:absolute after:-bottom-2.5 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-accent after:rounded-sm';
    heading.textContent = 'Featured Speakers';
    
    sectionTitle.appendChild(heading);

    // Create a speakers wrapper below the sponsors logos
    const wrapper = document.createElement('div');
    wrapper.className = 'speakers-container w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-4 mt-8';

    speakers.forEach(s => {
      const card = document.createElement('div');
      card.className = 'speaker-card bg-white rounded-lg p-4 md:p-3 flex flex-col items-center text-center shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1';

      const img = document.createElement('img');
      img.src = s.photo || 'https://via.placeholder.com/120';
      img.alt = s.name;
      img.className = 'w-[100px] h-[100px] md:w-[90px] md:h-[90px] rounded-full object-cover mb-3 border-2 border-primary-light';

      const name = document.createElement('div');
      name.className = 'font-semibold text-primary-dark text-sm mb-1';
      name.textContent = s.name;

      const org = document.createElement('div');
      org.className = 'text-[13px] text-text mb-1 font-medium';
      org.textContent = s.org;

      const title = document.createElement('div');
      title.className = 'text-[12px] text-gray-500';
      title.textContent = s.title;

      card.appendChild(img);
      card.appendChild(name);
      card.appendChild(org);
      card.appendChild(title);

      wrapper.appendChild(card);
    });

    sponsorsEl.insertAdjacentElement('afterend', sectionTitle);
    sectionTitle.insertAdjacentElement('afterend', wrapper);
  } catch (err) {
    console.error('Speakers load error:', err);
  }
}

// Run on DOMContentLoaded to ensure .sponsors exists
document.addEventListener('DOMContentLoaded', loadSpeakers);
