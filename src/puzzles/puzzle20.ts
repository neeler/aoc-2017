import { Puzzle } from './Puzzle';
import { getNumbers, splitFilter } from '~/util/parsing';

type Vector3D = [number, number, number];

interface Particle {
    index: number;
    p: Vector3D;
    v: Vector3D;
    a: Vector3D;
}

export const puzzle20 = new Puzzle({
    day: 20,
    parseInput: (fileData) => {
        return splitFilter(fileData).map((line, index): Particle => {
            const [pX, pY, pZ, vX, vY, vZ, aX, aY, aZ] = getNumbers(line) as [
                number,
                number,
                number,
                number,
                number,
                number,
                number,
                number,
                number,
            ];
            return {
                index,
                p: [pX, pY, pZ],
                v: [vX, vY, vZ],
                a: [aX, aY, aZ],
            };
        });
    },
    part1: (particles) => {
        const closestParticleCounts = new Map<number, number>();
        getClosestParticle(particles).forEach((particle) => {
            closestParticleCounts.set(
                particle.index,
                (closestParticleCounts.get(particle.index) ?? 0) + 1,
            );
        });
        for (let i = 0; i < 1000; i++) {
            particles.forEach((particle) => tickParticle(particle));
            getClosestParticle(particles).forEach((particle) => {
                closestParticleCounts.set(
                    particle.index,
                    (closestParticleCounts.get(particle.index) ?? 0) + 1,
                );
            });
        }
        const highestCount = Math.max(...closestParticleCounts.values());
        return [...closestParticleCounts].find(
            ([, count]) => count === highestCount,
        )![0];
    },
    part2: (particles) => {
        const remainingParticles = new Set(particles);
        const distanceBetweenParticles = new Map<string, number>();
        for (const particle of particles) {
            for (const otherParticle of particles) {
                if (particle !== otherParticle) {
                    const distance = getDistanceBetweenParticles(
                        particle,
                        otherParticle,
                    );
                    distanceBetweenParticles.set(
                        `${particle.index},${otherParticle.index}`,
                        distance,
                    );
                    distanceBetweenParticles.set(
                        `${otherParticle.index},${particle.index}`,
                        distance,
                    );
                }
            }
        }
        while (true) {
            if (remainingParticles.size < 2) {
                break;
            }
            for (const particle of remainingParticles) {
                tickParticle(particle);
            }
            const positions = new Map<string, Particle>();
            for (const particle of remainingParticles) {
                const position = particle.p.join(',');
                const existingParticle = positions.get(position);
                if (existingParticle) {
                    remainingParticles.delete(particle);
                    remainingParticles.delete(existingParticle);
                } else {
                    positions.set(position, particle);
                }
            }
            let someDistanceDecreased = false;
            const particlesSeen = new Set<Particle>();
            for (const particle of remainingParticles) {
                if (someDistanceDecreased) {
                    break;
                }
                if (!particlesSeen.has(particle)) {
                    particlesSeen.add(particle);
                    for (const otherParticle of remainingParticles) {
                        if (!particlesSeen.has(otherParticle)) {
                            const previousDistance =
                                distanceBetweenParticles.get(
                                    `${particle.index},${otherParticle.index}`,
                                ) ?? Infinity;
                            const distance = getDistanceBetweenParticles(
                                particle,
                                otherParticle,
                            );
                            distanceBetweenParticles.set(
                                `${particle.index},${otherParticle.index}`,
                                distance,
                            );
                            distanceBetweenParticles.set(
                                `${otherParticle.index},${particle.index}`,
                                distance,
                            );
                            if (previousDistance > distance) {
                                someDistanceDecreased = true;
                                break;
                            }
                        }
                    }
                }
            }
            if (!someDistanceDecreased) {
                break;
            }
        }
        return remainingParticles.size;
    },
});

function getClosestParticle(particles: Particle[]) {
    let closestDistance = Infinity;
    let closestParticles: Particle[] = [];
    for (const particle of particles) {
        const distance = particle.p.reduce(
            (sum, val) => sum + Math.abs(val),
            0,
        );
        if (distance < closestDistance) {
            closestDistance = distance;
            closestParticles = [particle];
        } else if (distance === closestDistance) {
            closestParticles.push(particle);
        }
    }
    return closestParticles;
}

function tickParticle(particle: Particle) {
    particle.v = particle.v.map((v, i) => v + particle.a[i]!) as Vector3D;
    particle.p = particle.p.map((p, i) => p + particle.v[i]!) as Vector3D;
}

function getDistanceBetweenParticles(particle1: Particle, particle2: Particle) {
    return particle1.p.reduce(
        (sum, val, i) => sum + Math.abs(val - particle2.p[i]!),
        0,
    );
}
