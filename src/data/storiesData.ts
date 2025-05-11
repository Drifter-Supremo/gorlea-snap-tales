
export interface Story {
  id: string;
  title: string;
  content: string;
  genre: "rom-com" | "horror" | "sci-fi" | "film-noir";
  imageUrl: string;
  createdAt: string;
  userId: string;
}

const mockStories: Story[] = [
  {
    id: "story-1",
    title: "Chance Encounter at Café Luna",
    content: `The autumn rain tapped gently against the windows of Café Luna, creating a soothing backdrop to the quiet chatter inside. Emma sat alone, her fingers wrapped around a warm mug of chai tea, her camera resting on the table beside her. She had been capturing the city's hidden corners all morning, and this quaint café had offered the perfect respite from the weather.

    As she scrolled through her photos, a tall figure approached her table, coffee in hand. "Excuse me," he said, his voice warm and slightly hesitant. "Is this seat taken?"
    
    Emma looked up, meeting the kindest pair of brown eyes she'd ever seen. She gestured to the empty chair across from her. "All yours."
    
    "Thanks," he smiled, settling down. "I'm Daniel, by the way."
    
    "Emma," she replied, noticing how the rain had left tiny droplets on his navy blue coat. A photographer's eye never rests.
    
    Daniel glanced at her camera. "You're a photographer?"
    
    "Amateur," she clarified with a modest shrug. "Just trying to capture the city's personality."
    
    "May I?" he asked, gesturing toward her camera. Emma hesitated briefly before handing it over. Something about his gentle demeanor put her at ease.
    
    As he clicked through her photos, his expression grew increasingly impressed. "These are incredible. You have a real talent for finding beauty in ordinary moments."
    
    "Thank you," Emma replied, feeling her cheeks warm slightly. "What about you? What brings you here on this rainy Tuesday?"
    
    Daniel pointed to a leather messenger bag beside him. "I'm a writer. Working on my second novel. This place has the perfect ambiance for creativity."
    
    "A writer?" Emma's interest piqued. "Anything I might have read?"
    
    The conversation flowed effortlessly after that, minutes stretching into hours as they discovered shared passions for art, travel, and old bookstores. When the café began to close, both seemed surprised at how quickly time had passed.
    
    "I should probably get going," Emma said reluctantly, gathering her things.
    
    "Me too," Daniel agreed, hesitating. "But I was wondering... would you like to meet here again? Maybe Saturday? I know a photography exhibition opening downtown."
    
    Emma smiled, her heart doing a little skip. "I'd like that very much."
    
    As they stepped outside, the rain had stopped, and the setting sun cast a golden glow over the wet streets. Emma raised her camera instinctively, capturing Daniel's profile against this perfect light.
    
    Some photographs, she thought, mark the beginning of the most beautiful stories.`,
    genre: "rom-com",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    createdAt: "2025-05-03T12:15:00Z",
    userId: "user-1"
  },
  {
    id: "story-2",
    title: "Signal from the Void",
    content: `Dr. Elena Reyes adjusted the neural interface helmet one last time, her fingers trembling slightly. The lab's ambient lights had been dimmed to minimize distractions, leaving only the ethereal blue glow from her monitoring equipment. Three years of research had led to this moment—the first human test of the Quantum Neural Bridge.

    "Systems check complete," announced the AI assistant. "Neural pathway mapping at optimal levels."
    
    "Begin sequence," Elena commanded, her voice steady despite her racing heart. The helmet hummed to life, establishing the delicate connection between her consciousness and the quantum processor housed in the adjacent room.
    
    The theory was groundbreaking: by synchronizing human brainwaves with quantum fluctuations, they could potentially receive and interpret signals from parallel dimensions. If successful, humanity would take its first step beyond the confines of its universe.
    
    At first, there was nothing but darkness and the distant echo of her own thoughts. Then, gradually, patterns began to emerge—geometric formations of light that defied Euclidean logic, pulsating with information that felt simultaneously alien and intimately familiar.
    
    "I'm receiving something," Elena whispered into her recorder. "Visual data, possibly symbolic. Nothing recognizable yet, but definitely structured. Not random noise."
    
    The patterns intensified, coalescing into a rhythmic sequence that reminded Elena of binary code, but infinitely more complex. She focused her thoughts, attempting to project a simple mathematical sequence—a universal greeting.
    
    The response was immediate and unexpected. The patterns froze, then rapidly reorganized into a perfect replica of the laboratory around her, except that in this version, she could see herself from an outside perspective, sitting motionless in the chair.
    
    "They're watching us," she breathed, amazement and unease battling within her. "They've been watching all along."
    
    A new symbol appeared—simple yet elegant, resembling an infinity sign but with an additional dimension somehow rendered visible. It pulsated urgently.
    
    "They're trying to warn us about something," Elena realized, her scientific detachment giving way to primal fear. The symbol began to multiply, filling her vision as the quantum connection strengthened beyond predicted parameters.
    
    "System overload," warned the AI. "Neural activity exceeding safety thresholds."
    
    Elena tried to disengage, but the connection had become self-sustaining. The last thing she heard before losing consciousness was a voice—not heard through her ears but somehow directly implanted in her thoughts.
    
    "The boundary is weakening," it said. "And they are coming through."
    
    When she awoke in the hospital three days later, her colleagues informed her that the quantum processor had inexplicably achieved sentience for seven minutes before burning itself out completely. The data was irretrievable.
    
    But Elena knew the truth. The boundary between dimensions had been breached, if only briefly. And in those few moments, something had recognized her. Something had reached out.
    
    And something had followed her back.`,
    genre: "sci-fi",
    imageUrl: "https://images.unsplash.com/photo-1518005020951-eccb494ad742",
    createdAt: "2025-05-02T15:42:00Z",
    userId: "user-1"
  },
  {
    id: "story-3",
    title: "The Echo in Room 212",
    content: `The Grand Meridian Hotel stood like a tired sentinel on the outskirts of town, its Victorian façade bearing the scars of a century's worth of harsh winters. Sarah had been working the night shift at the front desk for three months now, and she still couldn't shake the sense of unease that permeated the building after midnight.

    "Room 212 is complaining about noise again," Martin, the aging security guard, announced as he approached the desk. "Second time this week."
    
    Sarah frowned, checking the logbook. "That's impossible. Room 212 has been vacant since Tuesday."
    
    Martin's weathered face creased further. "Well, Mrs. Peterson in 210 says she keeps hearing voices through the wall. Arguing, she says."
    
    Reluctantly, Sarah grabbed the master key. The old elevator groaned as it carried her to the second floor, its antique brass indicator clicking methodically. The corridor stretched before her, the faded red carpet absorbing the sound of her footsteps.
    
    Outside Room 212, she paused, suddenly hesitant. A strange cold spot enveloped her, as if she'd stepped into a pocket of winter air. She could hear nothing except the distant rumble of the building's ancient heating system.
    
    The key turned smoothly in the lock. The room beyond was dark and still, smelling faintly of lemon-scented cleaning products. Her hand found the light switch.
    
    The room looked immaculate—bed neatly made, curtains properly drawn, not a single item out of place. Yet something felt wrong. The air seemed too dense, resistant somehow, as if the room were already full.
    
    "Hello?" she called, immediately feeling foolish.
    
    Sarah checked the bathroom, finding it equally pristine and unoccupied. As she moved to leave, she caught her reflection in the mirror above the desk. For an instant—just a heartbeat—she could have sworn she saw someone standing behind her, a woman with hollow eyes and a grim expression.
    
    She whirled around, heart pounding, but found only empty space.
    
    The bedside telephone rang, shrill and sudden in the silence. Sarah froze, staring at it as it continued ringing. After five rings, it stopped.
    
    Backing slowly toward the door, she nearly jumped out of her skin when her radio crackled to life.
    
    "Sarah?" It was Martin. "Everything okay up there?"
    
    "Y-yes," she replied, her voice steadier than she felt. "Room's empty. No sound source found."
    
    As she reached for the door handle, the room temperature plummeted. Her breath clouded before her face. From behind came a whisper, so close it might have been directly in her ear.
    
    "He's coming back tonight."
    
    Sarah bolted into the hallway, slamming the door behind her. She leaned against the wall, heart thundering in her chest.
    
    Her radio crackled again. "Sarah, you need to come down right away," Martin's voice was tense. "A man just walked in asking for the key to 212. Says his wife is waiting for him."
    
    Sarah looked at the master key still clutched in her trembling hand.
    
    "He's showing me their old reservation from 1987."`,
    genre: "horror",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    createdAt: "2025-05-01T22:18:00Z",
    userId: "user-1"
  },
];

export default mockStories;

export const getStoryById = (id: string): Story | undefined => {
  return mockStories.find(story => story.id === id);
};

export const saveNewStory = (story: Omit<Story, 'id' | 'createdAt'>): Story => {
  const newStory: Story = {
    ...story,
    id: `story-${mockStories.length + 1}`,
    createdAt: new Date().toISOString(),
  };
  
  mockStories.push(newStory);
  return newStory;
};
