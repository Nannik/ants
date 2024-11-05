

import * as gfx from 'gophergfx'
import { AnimatedBone } from './AnimatedBone';
import { AnimatedCharacter } from './AnimatedCharacter'

/**
 * This character draws 3D axes to represent the X,Y,Z axes of Bone Space for each bone
 * in the animated character.
 */
export class BoneSpaceAxesCharacter extends AnimatedCharacter
{
    constructor() {
        super();
    }

    public override addGeometryToAnimatedBone(bone: AnimatedBone): void
    {
        let size = 0.15;
        if (bone.name == "root") {
            size *= 2;
        } 
        const axes = gfx.Geometry3Factory.createAxes(size);
        bone.add(axes);
    }
}
