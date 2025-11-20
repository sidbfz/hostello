document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, MotionPathPlugin);

  const heroContent = document.querySelector('.hero__content');
  const external = document.querySelector('.external');
  const overview = document.querySelector('.hostello-overview');

  if (overview) {
    const animateTargets = overview.querySelectorAll('[data-animate]');

    if (animateTargets.length) {
      gsap.set(animateTargets, { opacity: 0, y: 72 });

      ScrollTrigger.batch(animateTargets, {
        start: 'top 85%',
        onEnter: batch => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.12,
            overwrite: true
          });
        },
        onLeaveBack: batch => {
          gsap.to(batch, {
            opacity: 0,
            y: 72,
            duration: 0.6,
            ease: 'power1.out',
            overwrite: true
          });
        }
      });
    }

    const parallaxItems = overview.querySelectorAll('[data-parallax-depth]');
    if (parallaxItems.length) {
      parallaxItems.forEach(item => {
        const depth = parseFloat(item.dataset.parallaxDepth) || 0;
        gsap.to(item, {
          yPercent: depth * -60,
          ease: 'none',
          scrollTrigger: {
            trigger: overview,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      });
    }

    const ratingScore = overview.querySelector('.hostello-overview__rating-score');
    if (ratingScore) {
      gsap.fromTo(ratingScore, { y: 0 }, {
        y: -8,
        duration: 2.6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });
    }

    const badge = overview.querySelector('#trip-badge');
    const pathSelector = '#northeastPath';
    const pulse = overview.querySelector('.hostello-overview__pulse');
    const pathElement = document.querySelector(pathSelector);
    const stops = gsap.utils.toArray('.trail-stop');
    const visual = overview.querySelector('.hostello-overview__visual');

    const placeStops = () => {
      if (!stops.length || !pathElement || !visual) return;

      const svg = pathElement.ownerSVGElement;
      const svgRect = svg.getBoundingClientRect();
      const visualRect = visual.getBoundingClientRect();
      const viewBox = svg.viewBox.baseVal;
      const scaleX = svgRect.width / viewBox.width;
      const scaleY = svgRect.height / viewBox.height;
      const offsetX = svgRect.left - visualRect.left;
      const offsetY = svgRect.top - visualRect.top;
      const totalLength = pathElement.getTotalLength();
      const isMobile = window.matchMedia('(max-width: 600px)').matches;
      const isTablet = window.matchMedia('(max-width: 900px)').matches;
      const yPercent = isMobile ? -105 : isTablet ? -112 : -120;

      stops.forEach(stop => {
        const progress = parseFloat(stop.dataset.progress || '0');
        const offsetXpx = parseFloat(stop.dataset.offsetX || '0');
        const offsetYpx = parseFloat(stop.dataset.offsetY || '0');
        const point = pathElement.getPointAtLength(totalLength * progress);
        const x = offsetX + point.x * scaleX + offsetXpx;
        const y = offsetY + point.y * scaleY + offsetYpx;

        gsap.set(stop, {
          x,
          y,
          xPercent: -50,
          yPercent,
          autoAlpha: 0
        });
      });
    };

    if (badge && pathElement) {
      const pathLength = pathElement.getTotalLength();

      gsap.set(pathElement, {
        strokeDasharray: '20 18',
        strokeDashoffset: pathLength,
        opacity: 0.9
      });

      gsap.set(badge, { scale: 0.9, opacity: 1 });
      if (pulse) {
        gsap.set(pulse, { scale: 1, opacity: 0.32 });
      }

      placeStops();
      window.addEventListener('resize', placeStops);
      ScrollTrigger.addEventListener('refreshInit', placeStops);

      const trailTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: overview,
          start: 'top 88%',
          end: 'bottom top',
          scrub: true
        }
      });

      trailTimeline.to(pathElement, { strokeDashoffset: 0, ease: 'none' });

      trailTimeline.to(badge, {
        motionPath: {
          path: pathElement,
          align: pathElement,
          autoRotate: false,
          alignOrigin: [0.5, 0.5]
        },
        ease: 'none',
        scale: 1,
        immediateRender: false,
        duration: 0.16
      }, 0.14);

      if (pulse) {
        trailTimeline.to(pulse, { scale: 1.28, opacity: 0.5, ease: 'sine.inOut' }, 0);
      }

      if (stops.length) {
        trailTimeline.to(stops, {
          autoAlpha: 1,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0
        }, 0.05);
      }
    }

    if (pulse && !badge) {
      gsap.to(pulse, {
        scale: 1.15,
        opacity: 0.3,
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });
    }
  }

  // Hide hero content when horizontal scroll section ends
  if (heroContent && external) {
    gsap.to(heroContent, {
      autoAlpha: 0,
      scrollTrigger: {
        trigger: external,
        start: 'bottom center',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // Mountain parallax scene
  const scrollDist = document.querySelector('.scrollDist');
  const parallaxScene = document.querySelector('.parallax-scene');
  const parallaxTrigger = overview || external || scrollDist;

  if (scrollDist && parallaxScene) {
    // Reveal mountain scene after the Hostello overview
    gsap.to(parallaxScene, {
      opacity: 1,
      pointerEvents: 'auto',
      scrollTrigger: {
        trigger: parallaxTrigger,
        start: 'bottom bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: '.scrollDist',
          start: '0 0',
          end: '100% 100%',
          scrub: 1
        }
      })
      .fromTo('.sky', { y: 0 }, { y: -200 }, 0)
      .fromTo('.cloud1', { y: 100 }, { y: -800 }, 0)
      .fromTo('.cloud2', { y: -150 }, { y: -500 }, 0)
      .fromTo('.cloud3', { y: -50 }, { y: -650 }, 0)
      .fromTo('.mountBg', { y: -10 }, { y: -100 }, 0)
      .fromTo('.mountMg', { y: -30 }, { y: -250 }, 0)
      .fromTo('.mountFg', { y: -50 }, { y: -600 }, 0);

    const arrowBtn = document.querySelector('#arrow-btn');
    if (arrowBtn) {
      arrowBtn.addEventListener('mouseenter', () => {
        gsap.to('.arrow', { y: 10, duration: 0.8, ease: 'back.inOut(3)', overwrite: 'auto' });
      });

      arrowBtn.addEventListener('mouseleave', () => {
        gsap.to('.arrow', { y: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
      });

      arrowBtn.addEventListener('click', () => {
        gsap.to(window, { scrollTo: innerHeight, duration: 1.5, ease: 'power1.inOut' });
      });
    }
  }

  // Black overlay animation to hide "FURTHER" text
  const blackOverlay = document.querySelector('.black-overlay');
  if (blackOverlay && scrollDist) {
    gsap.to(blackOverlay, {
      y: 0,
      scrollTrigger: {
        trigger: scrollDist,
        start: '30% top',
        end: '60% top',
        scrub: true
      }
    });
  }
});