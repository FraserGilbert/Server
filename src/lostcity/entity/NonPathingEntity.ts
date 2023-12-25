import Entity from '#lostcity/entity/Entity.ts';

export default abstract class NonPathingEntity extends Entity {
    resetEntity(respawn: boolean) {
        // nothing happens here
    }
}